import {expect} from "vitest";
import {programs} from "../src/data/programs";
import {render} from "@testing-library/svelte";


test("Testing current program contains ", () => {
    expect(programs).toBeTruthy();

});
