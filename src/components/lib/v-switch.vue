<script>
    export default {
        name: "vswitch",
        functional: true,
        props: {
            value: { type: [String, Number], required: true }
        },
        render(h, { data, props, scopedSlots }) {
            const { value } = props;
            const slotFn = value in scopedSlots ? scopedSlots[value] : scopedSlots.default;

            return slotFn ? slotFn(data.attrs) : null
        }
    }
</script>