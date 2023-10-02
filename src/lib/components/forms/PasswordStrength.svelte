<script>
    export let password
    import checkPasswordStrength from 'check-password-strength'

    $: strength = checkPasswordStrength.passwordStrength(password)


</script>

<style>
    #color-indicators {
        display: grid;
        grid-template-columns: repeat(4, 1fr);

    }

    #color-indicators span {
        height: 5px;
    }

    span.valid:nth-child(1) {
        background-color: #e3170a
    }

    span.valid:nth-child(2) {
        background-color: #F7B32B
    }

    span.valid:nth-child(3) {
        background-color: #FCF6B1
    }

    span.valid:nth-child(4) {
        background-color: #a9e5bb
    }


</style>

<div id="color-indicators">
    <span class:valid={strength.id >= 0}></span>
    <span class:valid={strength.id >= 1}></span>
    <span class:valid={strength.id >= 2}></span>
    <span class:valid={strength.id >= 3}></span>
</div>
<ul>


    {#if strength.length < 8}
        Your password must contain at least 8 digits.
    {/if}
    {#if (!strength.contains.includes("lowercase"))}
        <span> one lowercase,</span>
    {/if}

    {#if (!strength.contains.includes("uppercase"))}
        <span> one uppercase,</span>
    {/if}

    {#if (!strength.contains.includes("number"))}
        <span> one number,</span>
    {/if}


    {#if (!strength.contains.includes("symbol"))}
        <span> one symbol</span>
    {/if}


</ul>


