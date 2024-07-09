import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import PaginationClassic from '@/components/common/Pagination/PaginationClassic.vue';

const OFFSET = 2;

function assertSize(wrapper, size) {
    const pagination = wrapper.props().pagination;

    expect(
        wrapper.findAll('.pagination-classic__button:not(.pagination-classic__button--navigate)')
            .length,
        `Incorrect number of pages, pageCount: ${pagination.pageCount}, currentPage: ${pagination.currentPage}`
    ).toBe(size);
}

function changePage(wrapper, pagination, page) {
    wrapper.setProps({ pagination: { ...pagination, currentPage: page } });
}

describe('PaginationClassic', () => {
    describe('displays correctly in different keys (offset: 2)', () => {
        const pagination = {
            totalCount: 300,
            perPage: 10,
            pageCount: 30,
            currentPage: 5
        };

        const wrapper = mount(PaginationClassic, {
            props: {
                pagination,
                offset: OFFSET
            }
        });

        it('with a full list of pages', () => {
            assertSize(wrapper, OFFSET * 2 + 1);
        });

        it('with the penultimate page', async () => {
            await changePage(wrapper, pagination, 1);
            assertSize(wrapper, OFFSET * 2 + 1);

            await changePage(wrapper, pagination, 2);
            assertSize(wrapper, OFFSET * 2 + 1);

            await changePage(wrapper, pagination, 29);
            assertSize(wrapper, OFFSET * 2 + 1);

            await changePage(wrapper, pagination, 30);
            assertSize(wrapper, OFFSET * 2 + 1);
        });

        it('with a small number of pages (pageCount < offset * 2 + 1)', async () => {
            const _pagination = { ...pagination, pageCount: 4 };

            await changePage(wrapper, _pagination, 1);
            assertSize(wrapper, _pagination.pageCount);

            await changePage(wrapper, _pagination, 2);
            assertSize(wrapper, _pagination.pageCount);

            await changePage(wrapper, _pagination, 3);
            assertSize(wrapper, _pagination.pageCount);

            await changePage(wrapper, _pagination, 4);
            assertSize(wrapper, _pagination.pageCount);

            _pagination.pageCount = 2;

            await changePage(wrapper, _pagination, 1);
            assertSize(wrapper, _pagination.pageCount);

            await changePage(wrapper, _pagination, 2);
            assertSize(wrapper, _pagination.pageCount);
        });
    });
});
