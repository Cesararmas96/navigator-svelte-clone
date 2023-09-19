<script lang="ts">
    import {iconEquivalences} from "$lib/utils/migrateFontawesome";

    export let icon: string;
    export let size = "14px";
    export let classes = "";


    icon = icon.indexOf("fa fa-") === 0 ? iconEquivalences[icon] : icon;

</script>


<iconify-icon {icon} height={size} class={classes}/>
