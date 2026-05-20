import { SystemSettingsOutputDto } from '@/modules/system-settings/types/system-settings-output.type';
import { SystemSettingsDocumentType } from '@common/models/system-settings/system-settings.schema';

export function transformSystemSettings(
  doc: SystemSettingsDocumentType,
): SystemSettingsOutputDto {
  return {
    language: doc.language,
  };
}
