export function validate(body) {
  return body && typeof body.name === 'string' && body.name.trim().length > 0
    && body.name.trim().length <= 100 && Number.isInteger(body.age)
    && body.age >= 18 && body.age <= 100
    && typeof body.salary === 'number' && Number.isFinite(body.salary) && body.salary >= 0;
}

export function idFrom(req) {
  const id = Number(req.params.id);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}
