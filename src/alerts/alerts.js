import { Dialog } from "quasar";

const confirm = async () => {
  Dialog.create({
    title: "Confirm",
    message: "Would you like to turn on the wifi?",
    cancel: true,
    persistent: true,
  }).onOk(() => {
    console.log(true)
  })
  .onCancel(() => {
    console.log(false)
  })
};

export { confirm };
