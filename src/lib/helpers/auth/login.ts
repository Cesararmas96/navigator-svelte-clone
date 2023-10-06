    // export async function handleSubmit(e) {
    //   e.preventDefault();
    //
    //   const headers = new Headers(authMethod.headers);
    //   headers.append('Content-Type', 'application/json');
    //
    //   const response = await fetch(`${apiUrl}${authMethod.uri}`, {
    //     method: 'POST',
    //     headers,
    //     body: JSON.stringify({ username, password }),
    //   });
    //
    //   if (response.status === 200) {
    //     const { token } = await response.json();
    //     dispatch('success', token);
    //   } else {
    //     dispatch('fail');
    //   }
    // }
