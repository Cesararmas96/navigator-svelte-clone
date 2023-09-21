<script>
    import { createEventDispatcher } from 'svelte';

    export let authMethod;
    export let apiUrl
    let username = '';
    let password = '';

    const dispatch = createEventDispatcher();

    async function handleSubmit(e) {
      e.preventDefault();

      const headers = new Headers(authMethod.headers);
      headers.append('Content-Type', 'application/json');

      const response = await fetch(`${apiUrl}${authMethod.uri}`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ username, password }),
      });

      if (response.status === 200) {
        const { token } = await response.json();
        dispatch('success', token);
      } else {
        dispatch('fail');
      }
    }

    console.log(authMethod)
  </script>

  <form on:submit={handleSubmit} class="flex">
    <h2>{authMethod.name}</h2>
    {#if !authMethod.external}
      <input
        type="text"
        placeholder="Username"
        bind:value={username}
      />
      <input
        type="password"
        placeholder="Password"
        bind:value={password}
      />
    {/if}
    <button type="submit">Login</button>
  </form>


<style>
  /* Styling for the login form */
  form {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
    text-align: center; /* Center align the content within the form */
  }

  h2 {
    font-size: 24px;
    margin-bottom: 20px;
  }

  input[type="text"],
  input[type="password"] {
    width: 100%;
    padding: 10px;
    margin-bottom: 20px;
    border: 1px solid #ccc;
    border-radius: 3px;
    font-size: 16px;
  }

  button[type="submit"] {
    width: 100%;
    padding: 10px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 3px;
    font-size: 18px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  button[type="submit"]:hover {
    background-color: #0056b3;
  }
</style>
