import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import InputDate from "./InputDate.vue";

describe("InputDate Tests", () => {
  it("Компоент встроен на страницу", () => {
    const wrapper = mount(InputDate, {
      props: {
        value: new Date(2021, 1, 1),
      },
    });
    expect(wrapper.find("input").exists()).toEqual("01.02.2021");
  });
});
