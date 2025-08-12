import { TemplateDto } from './dtos/template.dto';

export type TemplatePreview = Pick<TemplateDto, 'id' | 'name' | 'description'>;

/**
 * Extra parameters to be passed to the ServiceNow API
 * @see https://developer.servicenow.com/dev.do#!/learn/learning-plans/xanadu/servicenow_application_developer/app_store_learnv2_rest_xanadu_request_parameters
 */
export type ExtraParams = {
  // Explicitly define the fields to be returned
  sysparm_fields: string;

  // When 'true' allows getting reference values as display values rather than reference ID's
  sysparm_display_value: 'true' | 'false';

  // When 'true' excludes reference link fields from the response
  sysparm_exclude_reference_link: 'true' | 'false';

  // Query string to filter the results
  sysparm_query: string;

  // Limit amount of records to be returned
  sysparm_limit?: string;

  // Offset for pagination
  sysparm_offset?: string;
};
