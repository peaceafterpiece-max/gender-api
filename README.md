# Gender Classification API

## Endpoint
GET /api/classify?name={name}

## Example
/api/classify?name=john

## Response
{
  "status": "success",
  "data": {
    "name": "john",
    "gender": "male",
    "probability": 0.99,
    "sample_size": 1234,
    "is_confident": true,
    "processed_at": "2026-04-15T10:00:00Z"
  }
}