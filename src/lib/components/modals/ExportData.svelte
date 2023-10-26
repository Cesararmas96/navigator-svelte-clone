<script lang="ts">
    import Icon from "$lib/components/common/Icon.svelte";


    export let props;
    const urlBase = import.meta.env.VITE_API_URL;
    const {query_slug} = props;
    const method = "POST";


    let icons = {
        download: "bi:download",
        window: "radix-icons:open-in-new-window"
    };
    let formats = [
        {
            value: "csv", name: "CSV", icon: "bi:filetype-csv", actions: {
                download: true,
                openInWindow: false

            }
        },
        {
            value: "xlsx", name: "XLSX", icon: "bi:filetype-xlsx", actions: {
                download: true,
                openInWindow: false
            }
        },
        {
            value: "html", name: "HTML", icon: "bi:filetype-html", actions: {
                download: true,
                openInWindow: true
            }
        },
        {
            value: "pdf", name: "PDF (coming soon)", icon: "bi:filetype-pdf", actions: {
                download: true,
                openInWindow: true
            }
        }
    ];

    function handleDownload(format: any) {
        const endpoint = `${urlBase}/api/v2/services/queries/${query_slug}:${format.value}`;
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
                console.log(format.value);
                link.href = url;
                link.setAttribute("download", `${query_slug}.${format.value}`);
                document.body.appendChild(link);
                link.click();
            }).catch(error => {
            console.error("Error downloading file:", error);
        });
    }


    function handleOpenInNewWindow(format) {

        try {

            window.open(`${urlBase}/api/v2/services/queries/${query_slug}:${format.value}`);
        } catch (e) {
            console.log(e.text);
        }
    }


</script>

<ul class="my-4 space-y-3">
    {#each formats as format}
        <li>
            <div
                    class="group flex items-center rounded-lg bg-gray-50 p-3 text-base font-bold text-gray-900 hover:bg-gray-100 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
            >
				<span class="ml-3 flex-1 items-center whitespace-nowrap">
					<Icon icon={format.icon} size="18" value={format.value}/>
                    {format.name}</span
                >
                {#if format.actions.openInWindow}
                    <button class="mx-2" on:click={() => handleOpenInNewWindow(format)}>
                        <Icon icon={icons.window} size="18" value={format.value}/>
                    </button>
                {/if}

                {#if format.actions.download}

                    <button on:click={() => handleDownload(format)} class="mx-2">
                        <Icon icon={icons.download} size="18" value={format.value}/>
                    </button>
                {/if}


            </div>
        </li>
    {/each}
</ul>
