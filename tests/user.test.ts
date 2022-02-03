import fetch from 'node-fetch';
import { randomBytes } from 'crypto';

const authorizedToken = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjUwMDM5MTEwNjUsImlhdCI6MTY0MzkxMDc2NSwic3ViIjoiMTIzNDU2Nzg5MTBhYmNkZWYiLCJuYmYiOjE2NDM5MTA3NjUsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMCIsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMCJ9.D2AP61Td-JLzOwJqnz_YWLVqzF10pcuV3YLo_SjaStMnbpphNx8TzUnJf_ldzDjqj0q69gtLHF9czdja3Mxaxw";

test("Should list users", async () => {
    const response = await fetch("http://localhost:8001/api/v1/users", {
      headers: {
        "content-type": "application/vnd.api+json",
        accept: "application/vnd.api+json",
        Authorization: `Bearer ${authorizedToken}`
      },
    });
    expect(response.status).toStrictEqual(200);
});

test("Should get profile", async () => {
    const response = await fetch("http://localhost:8001/api/v1/users/profile", {
      headers: {
        "content-type": "application/vnd.api+json",
        accept: "application/vnd.api+json",
        Authorization: `Bearer ${authorizedToken}`
      },
    });
    expect(response.status).toStrictEqual(200);
});


test("Should get user", async () => {
    const response = await fetch("http://localhost:8001/api/v1/users/12345678910abcdef", {
      headers: {
        "content-type": "application/vnd.api+json",
        accept: "application/vnd.api+json",
        Authorization: `Bearer ${authorizedToken}`
      },
    });
    expect(response.status).toStrictEqual(200);
});


test("Should get unexisting user", async () => {
    const response = await fetch("http://localhost:8001/api/v1/users/1234bcdef", {
      headers: {
        "content-type": "application/vnd.api+json",
        accept: "application/vnd.api+json",
        Authorization: `Bearer ${authorizedToken}`
      },
    });
    expect(response.status).toStrictEqual(404);
});

test("Should refuse unauthorized user", async () => {
    const response = await fetch("http://localhost:8001/api/v1/users", {
      headers: {
        "content-type": "application/vnd.api+json",
        accept: "application/vnd.api+json"
      },
    });
    expect(response.status).toStrictEqual(401);
});


test("Should refuse wrong content-type", async () => {
    const response = await fetch("http://localhost:8001/api/v1/users", {
      headers: {
        "content-type": "application/nd.api+json",
        accept: "application/vnd.api+json"
      },
    });
    expect(response.status).toStrictEqual(415);
});


test("Should refuse good content-type but with media chars", async () => {
    const response = await fetch("http://localhost:8001/api/v1/users", {
      headers: {
        "content-type": "application/vnd.api+json; encoding=UTF-8",
        accept: "application/vnd.api+json"
      },
    });
    expect(response.status).toStrictEqual(406);
});

test("Should refuse wrong accept", async () => {
    const response = await fetch("http://localhost:8001/api/v1/users", {
      headers: {
        "content-type": "application/vnd.api+json",
        accept: "application/json"
      },
    });
    expect(response.status).toStrictEqual(406);
});


test("Should deny > 128kb payloads", async () => {
  const bytes = randomBytes(131073);
  const response = await fetch("http://localhost:8001/api/v1/users", {
    method: "post",
    headers: {
      "content-type": "application/vnd.api+json",
      accept: "application/vnd.api+json",
    },
    body: JSON.stringify({ bytes: bytes.toString("hex") }),
  });
  expect(response.status).toStrictEqual(413);
});

