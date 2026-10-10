# Express Employee API
A local learning API with create, read, update, delete, and input validation.

## Run
Node.js 22+:
```sh
npm install
npm run check
npm start
```
Server: http://localhost:3000. Use Postman or the companion React dashboard.

| Method | Path | Result |
| --- | --- | --- |
| GET | /api/employees | List employees |
| GET | /api/employees/:id | Get employee |
| POST | /api/employees | Create employee |
| PUT | /api/employees/:id | Replace employee fields |
| DELETE | /api/employees/:id | Delete employee |

POST/PUT JSON:
```json
{"name":"Dilu","age":22,"salary":75000}
```
Age must be an integer from 18 to 100, salary a non-negative number,
and name a nonblank string of up to 100 characters.

## Scope
This starter stores data in memory and resets on restart. It binds to localhost,
has no authentication, and uses demonstration data. It is a local learning
project; persistence and authentication are future work.

## Next improvements
- Add database persistence.
- Add integration tests for status codes and invalid inputs.
- Add JWT authentication and authorization.

