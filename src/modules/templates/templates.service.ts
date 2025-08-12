import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ServiceNowService } from '../service-now/service-now.service';
import { OptionDto } from './dtos/option.dto';
import { TemplateFieldDto } from './dtos/template-field.dto';
import { TemplateDto } from './dtos/template.dto';
import { TemplatesQueryDto } from './dtos/templates-query.dto';
import { VariableSetDto } from './dtos/variable-set.dto';
import { ExtraParams } from './templates.interface';

@Injectable()
export class TemplatesService {
  constructor(private readonly serviceNowService: ServiceNowService) {}

  /**
   * Get templates list.
   * @param {TemplatesQueryDto} params
   * @returns {TemplateDto[]}
   */
  async getAll(params: TemplatesQueryDto): Promise<TemplateDto[]> {
    const { search, skip, limit } = params;
    const extraParams: ExtraParams = {
      sysparm_fields: 'sys_id,u_id,name,short_description',
      sysparm_display_value: 'true',
      sysparm_exclude_reference_link: 'true',
      sysparm_query: 'u_external=true^active=true^u_idISNOTEMPTY',
    };

    // Add limit params if provided
    if (typeof limit === 'number') extraParams.sysparm_limit = limit.toString();

    // Add offset param if provided
    if (typeof limit === 'number' && typeof skip === 'number')
      extraParams.sysparm_offset = skip.toString();

    // Add search query if provided
    if (search)
      extraParams.sysparm_query += `^nameLIKE${search}^ORmetaLIKE${search}`;

    const queryParams = new URLSearchParams(extraParams).toString();

    const res = await this.serviceNowService.fetch(
      `/api/now/table/sc_cat_item_producer?${queryParams}`,
    );

    const response: Awaited<{ result: any[] }> = await res.json();

    // If no result property found, return an empty array
    if (!response.result) return [];

    // Transform the response to a Template object
    const transformed = plainToInstance(TemplateDto, response.result, {
      excludeExtraneousValues: true,
    });

    return transformed;
  }

  /**
   *
   * @param param0
   * @returns
   */
  async submit({ templateId, variables }: any) {
    const res = await this.serviceNowService.fetch(
      `/api/sn_sc/servicecatalog/items/${templateId}/submit_producer`,
      {
        method: 'POST',
        body: JSON.stringify({ variables }),
      },
    );

    if (!res.ok) {
      const response = await res.json();

      // Prints the response to logs as plain text
      throw new Error(JSON.stringify(response));
    }

    return res.json();
  }

  /**
   * Get a template by its ID.
   * @param {string} templateId
   * @returns {TemplateDto | null}
   */
  async getTemplateById(templateId: string): Promise<TemplateDto | null> {
    const extraParams: ExtraParams = {
      sysparm_fields: 'sys_id,u_id,name,short_description',
      sysparm_display_value: 'true',
      sysparm_exclude_reference_link: 'true',
      sysparm_query: `u_external=true^active=true^u_idISNOTEMPTY^u_id=${templateId}`,
    };

    const queryParams = new URLSearchParams(extraParams).toString();

    const res = await this.serviceNowService.fetch(
      `/api/now/table/sc_cat_item_producer?${queryParams}`,
    );

    const response: Awaited<{ result: TemplateDto[] }> = await res.json();

    if (!response.result || response.result.length === 0) return null;

    const transformed = plainToInstance(TemplateDto, response.result[0], {
      excludeExtraneousValues: true,
    });

    return transformed;
  }

  /**
   * Get variable sets associated with a given template.
   * @param {} templateId
   * @returns {VariableSetDto[]}
   */
  async getVariableSets(templateId: string): Promise<VariableSetDto[]> {
    const extraParams: ExtraParams = {
      sysparm_fields: 'variable_set.sys_id,sc_cat_item.name,sc_cat_item.u_id',
      sysparm_display_value: 'true',
      sysparm_exclude_reference_link: 'true',
      sysparm_query: `sc_cat_item.active=true^sc_cat_item.ref_sc_cat_item_producer.u_id=${templateId}`,
    };

    const queryParams = new URLSearchParams(extraParams).toString();

    const res = await this.serviceNowService.fetch(
      `/api/now/table/io_set_item?${queryParams}`,
    );

    const response = await res.json();
    if (!response.result) return [];

    // Transform the response to a VariableSet objects array
    const transformed = plainToInstance<VariableSetDto, VariableSetDto[]>(
      VariableSetDto,
      response.result,
      {
        excludeExtraneousValues: true,
      },
    );

    return transformed;
  }

  /**
   * Get fields and options for a given template.
   * @param {string} templateId
   * @returns
   */
  async getTemplateFields(templateId: string): Promise<TemplateFieldDto[]> {
    const extraParams: ExtraParams = {
      sysparm_fields:
        'sys_id,option,mandatory,include_none,question_text,validate_regex,cat_item.sys_id,name,help_tag,validate_regex,type,u_external_classname',
      sysparm_display_value: 'true',
      sysparm_exclude_reference_link: 'true',
      sysparm_query: `ORDERBYorder^active=true^cat_item.active=true^cat_item.ref_sc_cat_item_producer.u_id=${templateId}`,
    };

    // First we want to check if there are any variable sets associated with the template,
    // Variable sets are generic fields not related to a specific template but can be
    // refereced to a template so it'll contain it.
    const variableSets = await this.getVariableSets(templateId);

    // If variable sets found, we modify the query filter to include those.
    if (variableSets && variableSets.length > 0) {
      for (let vs of variableSets) {
        extraParams.sysparm_query += `^NQvariable_set=${vs.id}`;
      }
    }

    const queryParams = new URLSearchParams(extraParams).toString();

    const res = await this.serviceNowService.fetch(
      `/api/now/table/item_option_new?${queryParams}`,
    );

    const response = await res.json();
    if (!response.result) return [];

    // Transform the response to an Option object array
    const transformed = plainToInstance<TemplateFieldDto, TemplateFieldDto[]>(
      TemplateFieldDto,
      response.result,
      {
        excludeExtraneousValues: true,
      },
    );

    return transformed;
  }

  /**
   * Get options for a given variable (field).
   * @param {string} variableId
   * @returns {OptionDto[]}
   */
  async getOptions(variableId: string): Promise<OptionDto[]> {
    const extraParams: ExtraParams = {
      sysparm_fields: 'sys_id,text,value,order',
      sysparm_display_value: 'true',
      sysparm_exclude_reference_link: 'true',
      sysparm_query: `question=${variableId}^ANDinactive=false`,
    };

    const queryParams = new URLSearchParams(extraParams).toString();

    const res = await this.serviceNowService.fetch(
      `/api/now/table/question_choice?${queryParams}`,
    );

    const response = await res.json();
    if (!response.result) return [];

    // Transform the response to an Option object array
    const transformed = plainToInstance<OptionDto, OptionDto[]>(
      OptionDto,
      response.result,
      {
        excludeExtraneousValues: true,
      },
    );

    return transformed;
  }
}
