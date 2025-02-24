import { SIZE_TO_COMPRESSION } from '@/const/messenger.js';
import imageCompression from 'browser-image-compression';
import { blobToFile } from '@/utils/helpers/forms/blobToFile.js';
import { ref, toValue } from 'vue';
import { useEventListener } from '@vueuse/core';
import { useNotify } from '@/utils/use/useNotify.js';
import { spliceById } from '@/utils/helpers/array/spliceById.js';

const compressionOptions = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true
};

export function usePasteFiles(node, source) {
    const notify = useNotify();

    let pastedUniqueIndex = 1;

    const loadingFiles = ref([]);

    function createFileWithUniqueName(pastedFile) {
        const uniqueName = `${pastedUniqueIndex}-${pastedFile.name}`;

        const file = new File([pastedFile], uniqueName, {
            type: pastedFile.type
        });

        pastedUniqueIndex++;

        return file;
    }

    function pasteHandler(event) {
        if (!event.clipboardData.files.length) return;

        const clipboardFiles = Array.from(event.clipboardData.files);

        clipboardFiles.forEach(element => {
            const file = createFileWithUniqueName(element);

            if (file.type.match('image')) {
                if (file.size >= SIZE_TO_COMPRESSION) {
                    const uid = `${file.name}-${file.lastModified}`;
                    loadingFiles.value.push({ id: uid, progress: 0 });

                    try {
                        imageCompression(file, {
                            ...compressionOptions,
                            onProgress: value => {
                                const index = loadingFiles.value.findIndex(
                                    element => element.id === uid
                                );

                                if (index !== -1) loadingFiles.value[index].progress = value;
                            }
                        }).then(async compressed => {
                            const _file = blobToFile(compressed, file);
                            _file.src = await imageCompression.getDataUrlFromFile(compressed);

                            toValue(source).push(_file);
                            spliceById(loadingFiles.value, uid);
                        });
                    } catch (e) {
                        notify.error(
                            'Произошла ошибка при оптимизации изображения. Попробуйте еще раз или используйте другое изображение',
                            'Загрузка изображения'
                        );

                        spliceById(loadingFiles.value, uid);
                    }
                } else {
                    imageCompression.getDataUrlFromFile(file).then(src => {
                        file.src = src;
                        toValue(source).push(file);
                    });
                }
            } else {
                toValue(source).push(file);
            }
        });
    }

    useEventListener(node, 'paste', pasteHandler);

    return { loadingFiles };
}
