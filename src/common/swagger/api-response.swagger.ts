import { ApiErrorResponse } from '../interface/interface';

export const SwaggerApiResponse: any = {
  success: (response?: any) => {
    const example = {
      response,
    };

    return {
      schema: {
        example,
      },
    };
  },

  exception: (responses: ApiErrorResponse[]) => {
    const examples = {};

    responses.forEach(({ name, example }) => {
      example.success = false;
      examples[name] = { value: example };
    });

    return {
      content: { 'application-json': { examples } },
    };
  },
};
