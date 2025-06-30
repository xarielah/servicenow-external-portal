import {
  BadRequestException,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Post,
} from '@nestjs/common';
import { FormsService } from './forms.service';

@Controller({ path: 'forms', version: '1' })
export class FormsControllerV1 {
  constructor(private readonly formsService: FormsService) {}

  private readonly logger = new Logger(FormsControllerV1.name);

  @Post('/:id')
  @HttpCode(HttpStatus.OK)
  async getIncident(@Param('id') templateId: string) {
    try {
      const res = await this.formsService.getTemplateFields(templateId);

      for (const field of res.result) {
        if (['Select Box', 'Multiple Choice'].includes(field.type)) {
          const options = await this.formsService.getOptions(field.sys_id);
          field.options = options.result;
        }
      }

      return res;
    } catch (error) {
      this.logger.error('getIncident: ' + error);
      throw new BadRequestException();
    }
  }
}
