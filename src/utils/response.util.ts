export function successResponse(message: string, result: any) {
  return {
    statusCode: 200,
    data: result,
    message,
    success: true,
  };
}
