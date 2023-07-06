import ko from "./src/locales/ko-KR.json";
type MessageSchema = typeof onKeyStroke;

declare module "vue-i18n" {
  export interface DefineLocaleMessage extends MessageSchema {}
}
