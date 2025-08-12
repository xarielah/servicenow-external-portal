import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SubmitProducerDto } from './dtos/submit-prod.dto';
import { TemplateFormDto } from './dtos/template-form.dto';
import { TemplateDto } from './dtos/template.dto';
import { TemplatesQueryDto } from './dtos/templates-query.dto';
import { TemplatesService } from './templates.service';

@Controller({ path: 'templates', version: '1' })
export class TemplatesControllerV1 {
  constructor(private readonly templateService: TemplatesService) {}

  private readonly logger = new Logger(TemplatesControllerV1.name);

  @Post('/')
  @ApiOperation({ summary: `Get templates` })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Templates successfully fetched',
    type: [TemplateDto],
  })
  @HttpCode(HttpStatus.OK)
  async getTemplates(@Query() query: TemplatesQueryDto) {
    try {
      const result = await this.templateService.getAll(query);

      return result;
    } catch (error) {
      this.logger.error('getTemplates: ' + error);
      throw new BadRequestException();
    }
  }

  @Post('/submit')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: `Submit record producer` })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Record submitted and created',
  })
  @ApiBody({ type: SubmitProducerDto })
  async submitRecordProducer(
    @Body() submitRecordProducerDto: SubmitProducerDto,
  ) {
    try {
      const { templateId, variables } = submitRecordProducerDto;
      console.log(
        '🚀 ~ TemplatesControllerV1 ~ submitRecordProducer ~ templateId, variables:',
        templateId,
        variables,
      );

      if (!templateId || !variables) throw new BadRequestException();

      const res = await this.templateService.submit({ templateId, variables });

      return { result: { number: res.result.number } };
    } catch (error) {
      this.logger.error('submitRecordProducer: ' + error);
      throw new BadRequestException();
    }
  }

  @Post('/:templateId')
  @ApiOperation({ summary: `Get template's fields and options` })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Fields and options successfully fetched',
    type: TemplateFormDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
  @HttpCode(HttpStatus.OK)
  async getTemplateById(@Param('templateId') templateId: number) {
    try {
      if (typeof templateId !== 'number') throw new BadRequestException();
      const templateIdStr = templateId.toString();

      const template =
        await this.templateService.getTemplateById(templateIdStr);

      if (!template) throw new Error(`Missing template with id ${templateId}`);

      let res = await this.templateService.getTemplateFields(templateIdStr);

      for (let i = 0; i < res.length; i++) {
        const field = res[i];

        if (['Select Box', 'Multiple Choice'].includes(field.type)) {
          const options = await this.templateService.getOptions(field.id);
          field.options = options;
        }
      }

      // Filter out unwanted field types so they don't reach to the frontend.
      res = res.filter((field: any) => !['Custom'].includes(field.type));

      const knowledge =
        await this.templateService.getTemplateKbs(templateIdStr);

      return { ...template, articles: knowledge, fields: res };
    } catch (error) {
      this.logger.error('getIncident: ' + error);
      throw new BadRequestException();
    }
  }
}
