export {
  useAdminMediaAssets,
  useDeleteAdminMediaAsset,
  useUploadAdminMediaAsset,
} from './model/useAdminMediaAssets'
export { MediaImageField, type MediaImageFieldLabels } from './ui/MediaImageField'
export { MediaLibraryModal, type MediaLibraryLabels } from './ui/MediaLibraryModal'

import type { MediaImageFieldLabels } from './ui/MediaImageField'

export const defaultMediaImageFieldLabels: MediaImageFieldLabels = {
  alt: 'Описание',
  choose: 'Выбрать',
  clear: 'Очистить',
  close: 'Закрыть',
  delete: 'Удалить',
  empty: 'Нет загруженных изображений',
  openLibrary: 'Выбрать из загруженных',
  title: 'Медиатека',
  upload: 'Загрузить новое',
}
