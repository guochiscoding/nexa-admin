import { createFromIconfontCN } from '@ant-design/icons-vue';

const defaultIconfontScriptUrl = '//at.alicdn.com/t/c/font_5242362_x1wr6cb2w8a.js';

export const IconFont = createFromIconfontCN({
  scriptUrl: import.meta.env.VITE_ICONFONT_SCRIPT_URL?.trim() || defaultIconfontScriptUrl,
});

export default IconFont;
