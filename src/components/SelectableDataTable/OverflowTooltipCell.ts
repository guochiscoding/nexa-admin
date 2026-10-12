import { defineComponent, h, nextTick, onUpdated, ref } from 'vue';
import { Tooltip as ATooltip } from 'ant-design-vue';

export const OverflowTooltipCell = defineComponent({
  name: 'OverflowTooltipCell',
  props: {
    contentClass: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  setup(cellProps, { slots: cellSlots }) {
    const contentRef = ref<HTMLElement>();
    const isOpen = ref(false);

    function isOverflowing(element: HTMLElement) {
      return element.scrollWidth - element.clientWidth > 1 || element.scrollHeight - element.clientHeight > 1;
    }

    function shouldOpenTooltip() {
      const element = contentRef.value;
      if (!element) {
        return false;
      }

      const cell = element.closest<HTMLElement>('.ant-table-cell');
      const tableCellContent = cell?.querySelector<HTMLElement>('.ant-table-cell-content');
      const slotContentTargets = Array.from(element.querySelectorAll<HTMLElement>('*'));
      const targets = [element, tableCellContent, ...slotContentTargets, cell].filter((target): target is HTMLElement => Boolean(target));

      return targets.some(isOverflowing);
    }

    function handleOpenChange(open: boolean) {
      isOpen.value = open && shouldOpenTooltip();
    }

    onUpdated(() => {
      if (isOpen.value) {
        void nextTick(() => {
          isOpen.value = shouldOpenTooltip();
        });
      }
    });

    return () => h(
      ATooltip,
      {
        title: cellProps.text,
        open: isOpen.value,
        placement: 'topLeft',
        onOpenChange: handleOpenChange,
      },
      {
        default: () => h('span', { ref: contentRef, class: cellProps.contentClass }, cellSlots.default?.() ?? cellProps.text),
      },
    );
  },
});

