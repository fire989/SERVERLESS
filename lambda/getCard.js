/* 
AWS Lambda 에서 제공하는 기본 코드

사용할 라이브러리를 명시.
사용할 클래스 명시 및 객체 생성
사용할 변수 명시

아래의 기본 코드에는 async 를 사용하고 있음.

즉, 클라이언트 요청(event) 을 비동기로 처리가 됨을 알 수 있음.

클라이언트의 요청(request)은 event 객체에 속성으로 있음.
*/
// delete, put, scan, update
var AWS = require('aws-sdk');

/* 
DynamoDB 를 사용하는 경우,
DynamoDB 의 데이터타입을 javascript 에서도 편하게 사용할 수 있도록
DocumentClient 클래스를 사용.

DynamoDB 의 최신 버전을 사용하기 위해서 버전정보를 명시.
*/
var documentClient = new AWS.DynamoDB.DocumentClient
    ({apiVersion: "2012-08-10"});

/* 
scan(param, callback) 을 사용하면, AWS.Request 클래스가 반환됨.
callback 을 명시하지 않으려면, AWS.Request 에 send() 를 붙여서 사용.

=> scan(param).send()

그런데, promise() 도 동일하게 요청사항을 전달. promise 로 반환됨.

그래서, DB와 통신을 할 때 비동기 방식으로 하게 되는데,
이때, promise() 메소드를 사용하면 좋다.

지금까지 API를 보는게 불편하고 힘들지만, 실제 코드는 심플함.
DB 와 통신은 비동기로 처리하고, 결과값을 반환 받기 위해서는
send() 대신 promise() 를 사용하면 됨.
*/

var dynamodb = new AWS.DynamoDB();


const tableName = "bs-22-111_Cards";
exports.handler = async (event) => {
    // 클라이언트의 요청 내용을 콘솔에 출력
    console.log("Received: " + JSON.stringify(event,null,2));

    let response = "";

    try {
        /* 
        documentClient.scan() 에 전달할 매개변수.

        TableName, FilterExpression, ExpressionAttributeValues

        현재는 조건없이 모든 데이터 조회. TableName 명시
        */

        var params = {
            TableName: tableName
        }
        /* 
        promise() 로 사용하면 DB 와 비동기 통신을 하게 되므로
        반드시 await 를 명시해야 함.

        ECMA script 에서 async, await 문법을 지원하고 있음.
        */

        const cards = await documentClient.scan(params).promise();

        /* 
        클라이언트에 반환될 성공된 결과를 작성.

        조회된 결과는 JSON 형태의 문자열로 반환하도록 함.

        statusCode, body 속성을 설정.
        response 객체의 속성임.
        나중에 API GateWay와 통합해서 사용할 때 필요함.
        */
       response={
        statusCode: 200, // 성공
        body: JSON.stringify(cards) // 조회된 결과
       };

    }catch(exception){
        console.error(exception);

        response={
            statusCode: 500, // 백엔드에서 에러가 발생해서 500 코드 전송
            body: JSON.stringify({"Message": exception}) // 에러 내용
           };
    }

    // 요청에 대해 처리한 결과를 반환.
    return response;
};
