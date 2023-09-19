<script lang="ts">
    import Icon from "$lib/components/common/Icon.svelte";


    export let props;
    const urlBase = import.meta.env.VITE_API_URL;
    const {query_slug} = props;
    const method = "POST";


    let formats = [
        {value: "csv", name: "CSV", icon: "bi:filetype-csv"},
        {value: "xlsx", name: "XLSX", icon: "bi:filetype-xlsx"},
        {value: "html", name: "HTML", icon: "bi:filetype-html"},
        {value: "pdf", name: "PDF (coming soon)", icon: "bi:filetype-pdf"}
    ];

    function handleExport(filetype) {
        const endpoint = `${urlBase}/api/v2/services/queries/${query_slug}:${filetype}`;
        fetch(endpoint, {
            method: method,
            headers: {
                "Content-Type": "application/json"
            },
        })
            .then(response => response.blob())
            .then(blob => {
                const url = window.URL.createObjectURL(new Blob([blob]));
                const link = document.createElement("a");
                console.log(filetype);
                link.href = url;
                link.setAttribute("download", `${query_slug}.${filetype}`);
                document.body.appendChild(link);
                link.click();
            });
    }
</script>

<ul class="my-4 space-y-3">
    {#each formats as format}
        <li>
            <a
                    href="#"
                    class="group flex items-center rounded-lg bg-gray-50 p-3 text-base font-bold text-gray-900 hover:bg-gray-100 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
                    on:click={() => handleExport(format.value)}
            >
				<span class="ml-3 flex-1 items-center whitespace-nowrap">
					<Icon icon={format.icon} size="18" value={format.value} action={handleExport}/>
                    {format.name}</span
                >
            </a>
        </li>
    {/each}
</ul>
