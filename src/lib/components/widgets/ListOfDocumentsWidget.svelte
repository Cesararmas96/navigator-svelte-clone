<script lang="ts">
    import {A, Card, P, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell} from "flowbite-svelte";
    import Icon from "$lib/components/common/Icon.svelte";
    import jsonData from "../../../data/widgetListOfDocuments.json";

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
                {#each data as el}
                    <TableBodyRow>
                        <TableHeadCell>
                            <div class="flex flex-row text-primary space-x-4" style="font-size: 14px">
                                <Icon icon={`ph:file-${el.filetype}`} size="20px"/>

                                <p class="font-medium">{el.title}</p>

                                <span class="space-x-1.5" style="margin-left: auto" href="#">

                                    <a href="{el.source}" target="_blank" rel="noopener noreferrer">
                                    <Icon icon='ph:eye' size="18px"/>
                                    </a>


                                    <a href={el.source} download={el.source}>
                                    <Icon icon='material-symbols:download' size="20px"/>
                                    </a>
                                </span>
                            </div>

                        </TableHeadCell>
                    </TableBodyRow>
                {/each}
            </TableBody>
        </Table>
    </Card>
</div>
