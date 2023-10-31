<script lang="ts">

    import {
        Card,
        Checkbox,
        TabItem,
        Table,
        TableBody,
        TableBodyCell,
        TableBodyRow,
        TableHead,
        TableHeadCell,
        Tabs
    } from "flowbite-svelte";
    import Icon from "$lib/components/common/Icon.svelte";
    import {getWidgetCategory} from "$lib/helpers/widgets/actions";

    export let widgets;

    console.log(widgets);
    $: console.log(widgets);


    const icons = {
        "fa fa-bar-chart": `/img/icons/bar.png`,
        "fa fa-area-chart": `/img/icons/area.png`,
        "fa fa-table": `/img/icons/grid.png`,
        "fa fa-circle-o-notch": `/img/icons/pie-2.png`,
        "fa fa-tachometer": `/img/icons/speedometer.png`,
        "fa fa-id-card-o": `/img/icons/id.png`,
        "fa fa-map": `/img/icons/map.png`,
        "fa fa-clock-o": `/img/icons/clock.png`,
        "far fa-rss": `/img/icons/rss.png`,
        "fa fa-desktop": `/img/icons/pc.png`,
        "material-symbols:iframe": `/img/icons/pc.png`,
        "fa fa-file-image-o": `/img/icons/photo.png`,
        "fa fa-film": `/img/icons/cinema.png`,
        "fa fa-youtube": `/img/icons/youtube.png`,
        "tabler:brand-spotify": `/img/icons/spotify.svg`,
        "tabler:carousel-horizontal": `/img/icons/gallery.png`,
        "tabler:wash-dry-shade": `/img/icons/content.png`,
        undefined: `/img/icons/loading.svg`,
        loading: `/img/icons/loading.svg`,
        "fa fa-flickr": `/img/icons/flickr.svg`
    };


</script>


<Tabs style="underline">
    <!--    Card View -->
    <TabItem open>
        <div slot="title" class="flex items-center gap-2">
            <Icon icon={'solar:widget-linear'} size="30px"></Icon>
            Card View
        </div>

        <div class="flex-row gap-4">
            <div class="grid grid-cols-6 gap-5">
                {#each widgets as widget}

                    <Card padding="none">

                        <div class="p-8 rounded-t-lg flex mr-auto">
                            <!--                            <Icon icon={widget?.attributes?.icon || ''} size={"48px"}/>-->
                            <img src={icons[widget?.attributes?.icon]} alt="" width="60"/>
                        </div>


                        <div class="px-5 pb-5">
                            <a href="/">
                                <h5 class="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">{widget.title}</h5>
                            </a>

                            <p class="mb-3 font-normal text-gray-700 dark:text-gray-400 leading-tight">{widget.description || widget.widget_name}</p>
                            <p class="mb-3 italic text-gray-700 dark:text-gray-400 leading-tight">{getWidgetCategory(widget)}</p>

                            <button class="mt-2.5 mb-1" on:click={() => widget.pin =!widget.pin}>
                                <Icon icon={widget.pin? 'tabler:pinned-off': 'tabler:pinned'} size={'22px'}/>
                            </button>
                            <button class="mt-2.5 mb-1" on:click={() => widget.like =!widget.like}>
                                <Icon icon={widget.like? 'twemoji:red-heart' : 'icon-park-outline:like'} size={'22px'}/>
                            </button>


                        </div>
                    </Card>
                {/each}
            </div>

        </div>


    </TabItem>
    <!--    Table view-->
    <TabItem>
        <div slot="title" class="flex items-center gap-2">
            <Icon icon={'lucide:sheet'} size="30px"></Icon>
            Table View
        </div>
        <Table>
            <TableHead>
                <TableHeadCell>Icon</TableHeadCell>
                <TableHeadCell>Title</TableHeadCell>
                <TableHeadCell>Type</TableHeadCell>
                <TableHeadCell>Description</TableHeadCell>
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
                        <TableBodyCell>
                            <div class="p-8 rounded-t-lg flex mr-auto">
                                <!--                            <Icon icon={widget?.attributes?.icon || ''} size={"48px"}/>-->
                                <img src={icons[widget?.attributes?.icon]} alt="" width="50"/>
                            </div>
                        </TableBodyCell>
                        <TableBodyCell>{widget.title}</TableBodyCell>
                        <TableBodyCell>{getWidgetCategory(widget)}</TableBodyCell>

                        <TableBodyCell>{widget.description || widget.widget_name}</TableBodyCell>
                        <TableBodyCell>
                            <button class="mt-2.5 mb-1" on:click={() => widget.like =!widget.like}>
                                <Icon icon={widget.like? 'twemoji:red-heart' : 'icon-park-outline:like'} size={'18px'}/>
                            </button>
                        </TableBodyCell>
                        <TableBodyCell>
                            <button class="mt-2.5 mb-1" on:click={() => widget.pin =!widget.pin}>
                                <Icon icon={widget.pin? 'tabler:pinned-off': 'tabler:pinned'} size={'20px'}/>
                            </button>
                        </TableBodyCell>
                    </TableBodyRow>
                {/each}

            </TableBody>
        </Table>


    </TabItem>

</Tabs>


<!--{#if gridMode === 'card'}-->
<!--    <div class="flex-row gap-4">-->
<!--        <div class="grid grid-cols-5 gap-5">-->
<!--            {#each widgets as widget}-->

<!--                <Card padding="none">-->

<!--                    &lt;!&ndash;                <img class="p-8 rounded-t-lg" src="/images/product-1.webp" alt="product 1"/>&ndash;&gt;-->


<!--                    <div class="p-8 rounded-t-lg">-->
<!--                        <Icon icon={widget?.attributes?.icon || ''} size={"48px"}/>-->
<!--                    </div>-->


<!--                    <div class="px-5 pb-5">-->
<!--                        <a href="/">-->
<!--                            <h5 class="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">{widget.title}</h5>-->
<!--                        </a>-->

<!--                        <p class="mb-3 font-normal text-gray-700 dark:text-gray-400 leading-tight">{widget.description || widget.widget_name}</p>-->


<!--                        <button class="mt-2.5 mb-1">-->
<!--                            <Icon icon={widget.pin? 'tabler:pinned-off': 'tabler:pinned-filled'} size={'22px'}/>-->
<!--                        </button>-->
<!--                        <button class="mt-2.5 mb-1">-->
<!--                            <Icon icon={widget.like? 'twemoji:red-heart' : 'icon-park-outline:like'} size={'22px'}/>-->
<!--                        </button>-->

<!--                    </div>-->
<!--                </Card>-->
<!--            {/each}-->
<!--        </div>-->

<!--    </div>-->
<!--{:else if gridMode === 'table'}-->


<!--    <Table>-->
<!--        <TableHead>-->
<!--            <TableHeadCell class="!p-4">-->
<!--                <Checkbox/>-->
<!--            </TableHeadCell>-->
<!--            <TableHeadCell>Icon</TableHeadCell>-->
<!--            <TableHeadCell>Widget Name</TableHeadCell>-->
<!--            <TableHeadCell>-->
<!--                <Icon icon={'icon-park-outline:like'} size={'18px'}/>-->
<!--            </TableHeadCell>-->
<!--            <TableHeadCell>-->
<!--                <Icon icon={'tabler:pinned'} size={'20px'}/>-->
<!--            </TableHeadCell>-->
<!--        </TableHead>-->
<!--        <TableBody class="divide-y">-->
<!--            {#each widgets as widget}-->
<!--                <TableBodyRow>-->
<!--                    <TableHeadCell class="!p-4">-->
<!--                        <Checkbox/>-->
<!--                    </TableHeadCell>-->
<!--                    <TableBodyCell>-->
<!--                        <Icon icon={widget?.attributes?.icon || ''} size={"48px"}/>-->
<!--                    </TableBodyCell>-->
<!--                    <TableBodyCell>{widget.title}</TableBodyCell>-->
<!--                    <TableBodyCell>-->
<!--                        <button class="mt-2.5 mb-1">-->
<!--                            <Icon icon={widget.like? 'twemoji:red-heart' : 'icon-park-outline:like'} size={'18px'}/>-->
<!--                        </button>-->
<!--                    </TableBodyCell>-->
<!--                    <TableBodyCell>-->
<!--                        <button class="mt-2.5 mb-1">-->
<!--                            <Icon icon={widget.pin? 'tabler:pinned-off': 'tabler:pinned'} size={'20px'}/>-->
<!--                        </button>-->
<!--                    </TableBodyCell>-->
<!--                </TableBodyRow>-->
<!--            {/each}-->
<!--            &lt;!&ndash;    <TableBodyRow>&ndash;&gt;-->
<!--            &lt;!&ndash;      <TableBodyCell>Microsoft Surface Pro</TableBodyCell>&ndash;&gt;-->
<!--            &lt;!&ndash;      <TableBodyCell>White</TableBodyCell>&ndash;&gt;-->
<!--            &lt;!&ndash;      <TableBodyCell>Laptop PC</TableBodyCell>&ndash;&gt;-->
<!--            &lt;!&ndash;      <TableBodyCell>$1999</TableBodyCell>&ndash;&gt;-->
<!--            &lt;!&ndash;    </TableBodyRow>&ndash;&gt;-->
<!--            &lt;!&ndash;    <TableBodyRow>&ndash;&gt;-->
<!--            &lt;!&ndash;      <TableBodyCell>Magic Mouse 2</TableBodyCell>&ndash;&gt;-->
<!--            &lt;!&ndash;      <TableBodyCell>Black</TableBodyCell>&ndash;&gt;-->
<!--            &lt;!&ndash;      <TableBodyCell>Accessories</TableBodyCell>&ndash;&gt;-->
<!--            &lt;!&ndash;      <TableBodyCell>$99</TableBodyCell>&ndash;&gt;-->
<!--            &lt;!&ndash;    </TableBodyRow>&ndash;&gt;-->
<!--        </TableBody>-->
<!--    </Table>-->

<!--{/if}-->

<!--<BottomNav position="sticky" classInner="grid-cols-2">-->
<!--    <BottomNavItem btnName="Card">-->
<!--        <Icon icon={'solar:widget-linear'} size="30px"></Icon>-->
<!--    </BottomNavItem>-->

<!--    <BottomNavItem btnName="Table">-->
<!--        <Icon icon={'lucide:sheet'} size="30px"></Icon>-->
<!--    </BottomNavItem>-->

<!--</BottomNav>-->

