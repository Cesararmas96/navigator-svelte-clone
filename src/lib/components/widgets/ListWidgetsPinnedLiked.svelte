<script lang="ts">

    // import widgetsDataJson from '../../../../data/widgetsData.json'
    import type {Writable} from "svelte/store";
    import {
        Card,
        Checkbox,
        Table,
        TableBody,
        TableBodyCell,
        TableBodyRow,
        TableHead,
        TableHeadCell
    } from "flowbite-svelte";
    import Header from "$lib/components/widgets/settings/Header.svelte";
    import Toolbar from "$lib/components/widgets/type/AgGrid/Toolbar.svelte";
    import Footer from "$lib/components/widgets/settings/Footer.svelte";
    import WidgetBox from "$lib/components/widgets/WidgetBox.svelte";
    import Widget from "$lib/components/widgets/Widget.svelte";
    import Icon from "$lib/components/common/Icon.svelte";

    export let widgets;

    console.log(widgets);
    $: console.log(widgets);


    let gridMode = "table";


    const handleGridSwitch = (mode: string) => {
        gridMode = mode;

    };


</script>
<button class="btn outline-dark-100 m-5" on:click={() => handleGridSwitch('card')}>Card</button>
<button class="btn outline-dark-100 m-5" on:click={() => handleGridSwitch('table')}>Table</button>


{#if gridMode === 'card'}
    <div class="flex-row gap-4">
        <div class="grid grid-cols-5 gap-5">
            {#each widgets as widget}

                <Card padding="none">

                    <!--                <img class="p-8 rounded-t-lg" src="/images/product-1.webp" alt="product 1"/>-->


                    <div class="p-8 rounded-t-lg">
                        <Icon icon={widget?.attributes?.icon || ''} size={"48px"}/>
                    </div>


                    <div class="px-5 pb-5">
                        <a href="/">
                            <h5 class="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">{widget.title}</h5>
                        </a>

                        <p class="mb-3 font-normal text-gray-700 dark:text-gray-400 leading-tight">{widget.description || widget.widget_name}</p>


                        <button class="mt-2.5 mb-1">
                            <Icon icon={widget.pin? 'tabler:pinned-off': 'tabler:pinned-filled'} size={'22px'}/>
                        </button>
                        <button class="mt-2.5 mb-1">
                            <Icon icon={widget.like? 'twemoji:red-heart' : 'icon-park-outline:like'} size={'22px'}/>
                        </button>

                    </div>
                </Card>
            {/each}
        </div>

    </div>
{:else if gridMode === 'table'}


    <Table>
        <TableHead>
            <TableHeadCell class="!p-4">
                <Checkbox/>
            </TableHeadCell>
            <TableHeadCell>Icon</TableHeadCell>
            <TableHeadCell>Widget Name</TableHeadCell>
            <TableHeadCell>
                <Icon icon={'icon-park-outline:like'} size={'18px'}/>
            </TableHeadCell>
            <TableHeadCell>
                <Icon icon={'tabler:pinned'} size={'20px'}/>
            </TableHeadCell>
        </TableHead>
        <TableBody class="divide-y">
            {#each widgets as widget}
                <TableBodyRow>
                    <TableHeadCell class="!p-4">
                        <Checkbox/>
                    </TableHeadCell>
                    <TableBodyCell>
                        <Icon icon={widget?.attributes?.icon || ''} size={"48px"}/>
                    </TableBodyCell>
                    <TableBodyCell>{widget.title}</TableBodyCell>
                    <TableBodyCell>
                        <button class="mt-2.5 mb-1">
                            <Icon icon={widget.like? 'twemoji:red-heart' : 'icon-park-outline:like'} size={'18px'}/>
                        </button>
                    </TableBodyCell>
                    <TableBodyCell>
                        <button class="mt-2.5 mb-1">
                            <Icon icon={widget.pin? 'tabler:pinned-off': 'tabler:pinned'} size={'20px'}/>
                        </button>
                    </TableBodyCell>
                </TableBodyRow>
            {/each}
            <!--    <TableBodyRow>-->
            <!--      <TableBodyCell>Microsoft Surface Pro</TableBodyCell>-->
            <!--      <TableBodyCell>White</TableBodyCell>-->
            <!--      <TableBodyCell>Laptop PC</TableBodyCell>-->
            <!--      <TableBodyCell>$1999</TableBodyCell>-->
            <!--    </TableBodyRow>-->
            <!--    <TableBodyRow>-->
            <!--      <TableBodyCell>Magic Mouse 2</TableBodyCell>-->
            <!--      <TableBodyCell>Black</TableBodyCell>-->
            <!--      <TableBodyCell>Accessories</TableBodyCell>-->
            <!--      <TableBodyCell>$99</TableBodyCell>-->
            <!--    </TableBodyRow>-->
        </TableBody>
    </Table>

{/if}



