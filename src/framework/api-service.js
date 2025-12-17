const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

export default class ApiService {
  constructor(endPoint) {
    this._endPoint = endPoint;
  }

  async _load({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers(),
  }) {
    const requestHeaders = new Headers(headers);
    
    if (body && !(body instanceof FormData)) {
      requestHeaders.set('Content-Type', 'application/json');
    }

    try {
      const response = await fetch(
        `${this._endPoint}/${url}`,
        { method, body, headers: requestHeaders },
      );

      ApiService.checkStatus(response);
      return response;
    } catch (err) {
      ApiService.catchError(err);
    }
  }

  static parseResponse(response) {
    return response.json();
  }

  static checkStatus(response) {
    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
  }

  static catchError(err) {
    throw err;
  }
}