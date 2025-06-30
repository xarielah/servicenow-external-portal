import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  Query,
} from '@nestjs/common';
import { GetTemplatesQueryDto } from './dtos/get-templates-query.dto';
import { SubmitRecordProducerDto } from './dtos/submit-record-producer.dto';
import { TemplatesService } from './templates.service';

@Controller({ path: 'templates', version: '1' })
export class TemplatesControllerV1 {
  constructor(private readonly templateService: TemplatesService) {}

  private readonly logger = new Logger(TemplatesControllerV1.name);

  @Post('/')
  async getTemplates(@Query() query: GetTemplatesQueryDto) {
    try {
      this.logger.log(
        `Getting templates with params: limit=${query.limit}, search=${query.search}, from=${query.from}, skip=${query.skip}`,
      );
      const result = await this.templateService.getAll(query);
      return result;
    } catch (error) {
      this.logger.error('getTemplates: ' + error);
      throw new BadRequestException();
    }
  }

  @Post('/submit')
  @HttpCode(HttpStatus.CREATED)
  async submitRecordProducer(
    @Body() submitRecordProducerDto: SubmitRecordProducerDto,
  ) {
    try {
      const { templateId, variables } = submitRecordProducerDto;

      const res = await this.templateService.submit({ templateId, variables });

      return { result: { number: res.result.number } };
    } catch (error) {
      this.logger.error('submitRecordProducer: ' + error);
      throw new BadRequestException();
    }
  }
}
