import {
  BadRequestException,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Post,
} from '@nestjs/common';
import { TemplatesService } from '../templates/templates.service';
import { transnformQuestion, trasnformOption } from './form.transform';
import { FormsService } from './forms.service';

@Controller({ path: 'forms', version: '1' })
export class FormsControllerV1 {
  constructor(
    private readonly formsService: FormsService,
    private readonly templateService: TemplatesService,
  ) {}

  private readonly logger = new Logger(FormsControllerV1.name);

  @Post('/:id')
  @HttpCode(HttpStatus.OK)
  async getTemplateForm(@Param('id') templateId: number) {
    try {
      if (typeof templateId !== 'number') throw new BadRequestException();
      const templateIdStr = templateId.toString();

      const template =
        await this.templateService.getTemplateById(templateIdStr);

      if (!template) throw new Error(`Missing template with id ${templateId}`);

      const res = await this.formsService.getTemplateFields(templateIdStr);

      if (!res.result) throw new Error(`Missing results array from response`);

      for (let i = 0; i < res.result.length; i++) {
        const field = res.result[i];
        res.result[i] = transnformQuestion(field);

        if (['Select Box', 'Multiple Choice'].includes(field.type)) {
          const options = await this.formsService.getOptions(field.sys_id);
          res.result[i].options = options.result.map((option: any) =>
            trasnformOption(option),
          );
        }
      }

      res.result = res.result.filter(
        (field: any) => !['Custom'].includes(field.type),
      );

      const formResult = {
        topic: template,
        fields: res.result,
        kb: [],
        alerts: [],
      };

      return { result: formResult };
    } catch (error) {
      this.logger.error('getIncident: ' + error);
      throw new BadRequestException();
    }
  }
}
