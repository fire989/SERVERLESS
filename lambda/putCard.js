// delete, put, scan, update
var AWS = require('aws-sdk');

var documentClient = new AWS.DynamoDB.DocumentClient
    ({apiVersion: "2012-08-10"});

var dynamodb = new AWS.DynamoDB();

const tableName = "bs-22-111_Cards";
exports.handler = async (event) => {
    // 클라이언트의 요청 내용을 콘솔에 출력
    console.log("Received: " + JSON.stringify(event,null,2));

    let response = "";

    try {
        /* 
        
        */
       const id = event.pathParameters.id;
       const body = JSON.stringify(event.body);

        var params = {
            TableName: tableName,
            Key: {
                id: id
            },
            UpdateExpression: "set #c = :c, #t = :t",
            ExpressionAttributeNames: {"#c": "category", "#t" : "title"},
            ExpressionAttributeValues: {
                ":c" : body.category,
                ":t" : body.title
            }
        };
        
        // 해당하는 id에 데이터를 삭제
        await documentClient.update(params).promise();

       response={
            statusCode: 200, // 성공
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
