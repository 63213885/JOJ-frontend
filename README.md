# JOJ-frontend
一个OJ

## 根据后台生成代码
```shell
openapi --input http://localhost:8081/api/v2/api-docs --output ./generated --client axios
```
失败的话
```shell
curl http://localhost:8081/api/v2/api-docs -o swagger.json
openapi --input ./swagger.json --output ./generated --client axios
```
