import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { SwaggerApiResponse } from 'src/common/swagger/api-response.swagger';
import { GetAdviseDto } from '../dto/get-advise.dto';

export function ApiGetAdviseFromChemist() {
  return applyDecorators(
    ApiOperation({
      summary: '약사에게 물어보기',
      description: '질병[] , 의약품 성분[] 전달',
    }),
    ApiBody({
      description:
        'ingredients 예시 중 하나만 선택하여 테스트를 진행해 주세요.',
      type: GetAdviseDto,
    }),
    ApiOkResponse(
      SwaggerApiResponse.success([
        {
          name: '이약1캡슐',
          criteria: 1,
          reason: null,
          characteristic: '복용 방법에 따라 다양한 용도로 사용됩니다.',
          intake: null,
        },
        {
          name: '아세트아미노펜(KP)',
          criteria: 1,
          reason: null,
          characteristic:
            '해열, 진통 효과가 있으며, 적정 섭취량은 개인의 체중과 건강 상태에 따라 다를 수 있습니다.',
          intake: null,
        },
        {
          name: '덱스트로메토르판브롬화수소산염수화물 (KP)',
          criteria: 1,
          reason: null,
          characteristic:
            '기침 억제 효과가 있으며, 적정 섭취량은 개인의 체중과 건강 상태에 따라 다를 수 있습니다.',
          intake: null,
        },
        {
          name: '슈도에페드린염산염(USP)',
          criteria: 2,
          reason: '과도한 섭취 시 심장 및 혈압에 부작용을 일으킬 수 있습니다.',
          characteristic: '콧물, 부비동 충혈 등 증상 완화를 위해 사용됩니다.',
          intake:
            '일반적으로 하루 섭취량은 60mg 이하로 권장됩니다. 섭취 시 심장 및 혈압 상태를 주의하여야 합니다.',
        },
        {
          name: '트리프롤리딘염산염수화물(USP)',
          criteria: 1,
          reason: null,
          characteristic: '알레르기 증상 완화를 위해 사용됩니다.',
          intake: null,
        },
        {
          name: 'd-메틸에페드린염산염(KP)',
          criteria: 2,
          reason: '과도한 섭취 시 심장 및 혈압에 부작용을 일으킬 수 있습니다.',
          characteristic: '감기 증상 완화를 위해 사용됩니다.',
          intake:
            '일반적으로 하루 섭취량은 60mg 이하로 권장됩니다. 섭취 시 심장 및 혈압 상태를 주의하여야 합니다.',
        },
      ]),
    ),
  );
}
