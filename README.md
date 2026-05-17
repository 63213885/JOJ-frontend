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

微服务这样：

```shell
curl http://localhost:8082/api/v2/api-docs -o swagger.json
openapi --input ./swagger.json --output ./generated/user --client axios

curl http://localhost:8083/api/v2/api-docs -o swagger.json
openapi --input ./swagger.json --output ./generated/problem --client axios
```
