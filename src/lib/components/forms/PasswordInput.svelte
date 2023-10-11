<script>
    import Icon from "$lib/components/common/Icon.svelte";

    let passwordVisible = false;

    function togglePasswordVisibility() {
        passwordVisible = !passwordVisible;
    }
</script>


<div class="relative">
    <input type={passwordVisible ? 'text' : 'password'} placeholder="Password" style="min-width: 600px"/>
    <button on:click={togglePasswordVisibility} class="ml-2">
        <Icon icon={passwordVisible ? 'carbon:view' : 'carbon:view-off'} size="23px"/>
    </button>
</div>

