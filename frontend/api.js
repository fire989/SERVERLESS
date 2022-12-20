/* 
  추가1 : AWS API Gateway 호출 경로 상수 변수로 작성.
  */
  const HOST = "https://0biafo49qg.execute-api.ap-south-1.amazonaws.com/production";

  /* 
  추가2 : 사용자 정의 Request 객체 생성.
  HTTP 통신에 필요한 정보를 관리하기 위한 용도
  - GET, DELETE 경우, body 가 없음.
  body 매개변수를 null로 초기화.
  */
class APIRequest{
  constructor(method,path,body = null){
    this.method = method;
    this.url = HOST + path;
    this.body = body;
  }
}
  /* 
  추가3 : 추가 2번에서 만든 Request 객체를 매개변수로 HTTP 통신을 수행하는 함수.
  - fetch method
  - CORS 모드로 통신
  - response 의 status 코드로 요청별로 세분화
  */
 const APIProcessor = async request => {
  try{
     // 옵션 기본 값은 *로 강조
  const response = await fetch(request.url, {
    method: request.method, 
    mode: 'cors', 
    cache: 'no-cache', 
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: request.body ? JSON.stringify(request.body) : null,
  });
  /* 
  통신 후 성공인 status 코드
  post lambda : statusCode 201 로.
  put lambda : statusCode 204 로.
  delete lambda : statusCode 204 로
  */

  switch(response.status){
    case 200:
      case 201:
        return await response.json();
      case 204:
        return null;
      default:
        console.error(await response.json());
  }


  }catch(e){
    console.error(e);
  }
  return "Error";
 };

export default class APIHandler {

  /* 
  Back-End 를 구현하기 전에 Front-End 를 먼저 구현.
  가상의 DB 연동을 통한 데이터 작업을 CRUD 로 구현 및 테스트.
  Front-End 와 Back-End 의 연동테스트를 진행.

  => local 버전이 완성. => AWS 기능을 구현.
  */

  /* 
  수정1 : 생성자 내부의 테스트 DB 코드 삭제.
  */
  constructor() {
    /* 
    DB 역할을 하는 Dummy 데이터를 비열 형태로 저장해서 사용.
    */
  }

  // TODO: 전체 카드 객체 리스트 반환. 없으면 NULL
  async getCards() {    

    const request = new APIRequest("GET","/kanban/cards");

    const response = await APIProcessor(request);

    if(response !== "Error"){
      console.log(response);
      return response.Items;
    } else {
      return null;
    }
  }

  // TODO: 카드 객체 생성/추가 후 ID 반환
  async postCard(cardObj) {

    /**
     * 1. getCards() 의 코드를 복사 후 수정 사용
     * 2. APIRequest 의 매개변수를 수정
     *    - GET을 POST로
     *    - body 추가
     */
     const request =
     new APIRequest("POST",
       "/kanban/cards",
       {
         title: cardObj.title,
         category: cardObj.category
       }
     );

   //client(웹브라우저) 의 요청을 처리하는 메소드 호출
   const response = await APIProcessor(request);
   if (response !== "Error") {
     console.log(response);
     /**
      * 3. 등록이 되면 id 가 반환됨.
      *    response.Items 을 response.id 수정.
      */
     return response.id;
   } else {
     return null;
   }
  }

  // TODO: ID로 카드 검색 후 내용,카테고리 수정
  async putCard(cardObj) { 
    /* 
    향후 Card Entity 의 속성이 추가될 것을 고려
    ecma script 문법 : "...." 을 사용.
    추가된 속성에 대해서 지정하지 않은 속성이 있다면,
    속성값을 그대로 사용함.
    */   

   const request =
      new APIRequest("PUT",
        `/kanban/cards/${cardObj.id}`,
        {
          title: cardObj.title,
          category: cardObj.category
        }
      );

    //client(웹브라우저) 의 요청을 처리하는 메소드 호출
    await APIProcessor(request);

  }

  // TODO: ID로 카드 검색 후 삭제
  async deleteCard(id) {
    /* 
    ecma script 의 filter를 사용.
    this.dummyData 를  매개변수로 입력된 id를 제외한 리스트로 초기화를 해주면 됨.
    => 마치 삭제된 효과가 됨.
    */

    const request =
      new APIRequest("DELETE",
        `/kanban/cards/${id}`
      );

    //client(웹브라우저) 의 요청을 처리하는 메소드 호출
    await APIProcessor(request);
  }

  // TODO: API 요청 컨테이너. Method, Path, Body 속성 
  // TODO: API 호출 함수
}

