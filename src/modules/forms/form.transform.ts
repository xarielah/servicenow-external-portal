export function transnformQuestion(question: any) {
  return {
    id: question.sys_id,
    text: question.question_text,
    type: question.type,
    mandatory: question.mandatory == 'true',
    name: question.name,
    templateId: question['cat_item.sys_id'],
    options: question.options,
    className: question.u_external_classname,
  };
}

export function trasnformOption(option: any) {
  return {
    id: option.sys_id,
    text: option.text,
    value: option.value,
  };
}
