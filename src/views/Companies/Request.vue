<template>
  <div>
    <vue3-html2pdf
      :show-layout="true"
      :float-layout="true"
      :enable-download="true"
      :preview-modal="true"
      :paginate-elements-by-height="1400"
      filename="heehee"
      :pdf-quality="2"
      :manual-pagination="false"
      pdf-format="a4"
      pdf-orientation="portrait"
      pdf-content-width="800px"
      :html-to-pdf-options="{
        margin: 0,

        filename: `hehehe.pdf`,

        image: {
          type: 'jpeg',
          quality: 0.98,
        },

        enableLinks: true,

        html2canvas: {
          scale: 1,
          useCORS: true,
        },

        jsPDF: {
          unit: 'in',
          format: 'a4',
          orientation: 'portrait',
        },
      }"
      @progress="onProgress($event)"
      @hasStartedGeneration="hasStartedGeneration()"
      @hasGenerated="hasGenerated($event)"
      ref="html2Pdf"
    >
      <template #pdf-content>
        <PdfContent />
        <button class="btn btn-primary" @click="generateReport">
          GeneratePfd
        </button>
      </template>
    </vue3-html2pdf>
  </div>
</template>

<script>
// wk html to pdf

import Vue3Html2pdf from "vue3-html2pdf";
import PdfContent from "@/components/PDF.vue";
export default {
  name: "Request",
  methods: {
    /*
            Generate Report using refs and calling the
            refs function generatePdf()
        */
    generateReport() {
      this.$refs.html2Pdf.generatePdf();
    },
    // async beforeDownload({ html2pdf, options, pdfContent }) {
    //   await html2pdf()
    //     .set(options)
    //     .from(pdfContent)
    //     .toPdf()
    //     .get("pdf")
    //     .then((pdf) => {
    //       const totalPages = pdf.internal.getNumberOfPages();
    //       for (let i = 1; i <= totalPages; i++) {
    //         pdf.setPage(i);
    //         pdf.setFontSize(10);
    //         pdf.setTextColor(150);
    //         pdf.text(
    //           "Page " + i + " of " + totalPages,
    //           pdf.internal.pageSize.getWidth() * 0.88,
    //           pdf.internal.pageSize.getHeight() - 0.3
    //         );
    //       }
    //     })
    //     .save();
    // },
  },

  components: {
    Vue3Html2pdf,
    PdfContent,
  },
};
</script>

<style>
</style>