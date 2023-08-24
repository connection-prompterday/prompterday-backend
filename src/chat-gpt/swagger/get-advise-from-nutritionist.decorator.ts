import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { SwaggerApiResponse } from 'src/common/swagger/api-response.swagger';
import { GetAdviseDto } from '../dto/get-advise.dto';

export function ApiGetAdviseFromNutritionist() {
  return applyDecorators(
    ApiOperation({
      summary: '영양사에게 물어보기',
      description: '질병[] , 원재료명[] 전달',
    }),
    ApiBody({
      type: GetAdviseDto, // Import the GetAdviseDto class
    }),
    ApiOkResponse(
      SwaggerApiResponse.success([
        {
          name: '카페인',
          criteria: 2,
          reason:
            '과다 섭취 시 수면장애, 심장박동 증가 등의 부작용이 있을 수 있습니다.',
          characteristic: '음료나 음식에 첨가되어 각성 효과를 주는 성분입니다.',
          intake: '400mg 이하',
        },
        {
          name: '아스파탐',
          criteria: 3,
          reason:
            '과다 섭취 시 두통, 어지러움, 심장박동 증가 등의 부작용이 있을 수 있습니다.',
          characteristic: '인공 감미료로 사용되며, 음료나 음식에 첨가됩니다.',
          intake: null,
        },
        {
          name: '알로에',
          criteria: 1,
          reason: null,
          characteristic:
            '식물로부터 추출된 성분으로, 주로 피부에 사용되는데 건강에 해로운 부작용은 없습니다.',
          intake: null,
        },
        {
          name: '밀가루',
          criteria: 1,
          reason: null,
          characteristic:
            '주로 빵, 과자, 면 등의 제품에 사용되는 원재료입니다.',
          intake: null,
        },
        {
          name: '가공유지(팜분별유(부분경화유:말레이시아산)',
          criteria: 3,
          reason:
            '과다 섭취 시 고지혈증, 심장질환 등의 위험을 초래할 수 있습니다.',
          characteristic: '식품가공 과정에서 사용되는 기름 성분입니다.',
          intake: null,
        },
      ]),
    ),
  );
}
