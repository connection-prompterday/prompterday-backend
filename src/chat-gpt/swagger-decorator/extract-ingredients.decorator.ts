import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { SwaggerApiResponse } from 'src/common/swagger/api-response.swagger';
import { ExtractIngredientsDto } from '../dto/extract-ingredients-dto';

export function ApiExtractIngredients() {
  return applyDecorators(
    ApiOperation({
      summary: '원재료 추출',
      description: '스캔한 텍스트와 타겟 전달',
    }),
    ApiBody({
      type: ExtractIngredientsDto,
    }),
    ApiOkResponse(
      SwaggerApiResponse.success([
        '이약1캡슐(900mg) 중아세트아미노펜(KP) 180.00mg',
        '덱스트로메토르판브롬화수소산염수화물 (KP) 8.00mg',
        '슈도에페드린염산염(USP) 1500mg',
        '트리프롤리딘염산염수화물(USP) 0.66mg',
        'd-메틸에페드린염산염(KP) 1250mg',
      ]),
    ),
  );
}
