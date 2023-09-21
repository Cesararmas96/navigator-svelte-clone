<script>
    import { createEventDispatcher } from 'svelte';
    import {Input, Label, Helper, Button, Checkbox, A, Card, P} from 'flowbite-svelte';

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

    <P size="4xl" class="text-center">{authMethod.name}</P>
  <form on:submit={handleSubmit} class="">
    {#if !authMethod.external}
      <Card class="content-center m-auto mb-20">

    <Label for="first_name" class="mb-2 flex flex-col">Username</Label>
    <Input class="flex flex-col" type="text" id="first_name" placeholder="Username" required   bind:value={username}/>

    <Label for="password" class="mb-2">Password</Label>
    <Input bind:value={password} type="password" id="password" placeholder="•••••••••" required />
    <Button type="submit" class="mt-3">Submit</Button>
      </Card>
    {/if}

  </form>





