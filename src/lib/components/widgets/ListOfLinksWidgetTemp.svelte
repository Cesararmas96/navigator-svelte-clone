<script lang="ts">
    import {A, Card, P, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell} from "flowbite-svelte";
    import Icon from "$lib/components/common/Icon.svelte";
    import jsonData from "../../../data/widgetListOfLinks.json";

    const getWidgetCardData = (jsonData: any) => {
        const data = jsonData;
        console.log(data);
        return data;

    };


    const data = getWidgetCardData(jsonData);


</script>


<div class="mx-5">

    <Card>
        <Table>
            <TableBody>
                {#each data as el, index}
                    <TableBodyRow>
                        <TableHeadCell>
                            <div class="flex flex-row text-primary">
                                <p class="mr-2 font-medium" style="font-size: 14px">{index + 1}</p>


                                <A class="font-medium hover:underline flex ml-auto mr-auto"
                                   href={el.href}>

                                    <span style="font-size: 13px">
                                    {el.title}
                                    </span>

                                </A>

                            </div>
                        </TableHeadCell>
                    </TableBodyRow>
                {/each}
            </TableBody>
        </Table>
    </Card>
</div>
