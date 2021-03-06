<template>
  <div class="pa-md">
    <DataTable
      :rows="data"
      :columns="columns"
      @delete="deleteMany"
    >
      <div
        class="action-group"
        slot="actions"
        slot-scope="{col, row}"
      >
        <Button
          class="small primary"
          @click="editProperty(row)"
        >
          <i class="fas fa-pen icon" />
          <Popover
            class="tooltip"
            placement="bottom"
            appendToBody
          >
            <div style="width: 100px">
              Clique para editar a property '
              <b>{{row.name}}</b>''
            </div>
          </Popover>
        </Button>
        <Button
          class="small danger"
          @click="deleteProperty(row)"
        >
          <i class="fas fa-trash icon" />
          <Popover
            class="tooltip"
            placement="bottom"
            appendToBody
          >
            <div style="width: 100px">
              Clique para deletar a property '
              <b>{{row.name}}</b>''
            </div>
          </Popover>
        </Button>
      </div>
    </DataTable>
  </div>
</template>

<script>
import ReactiveForm from "./../forms/ReactiveForm.vue";

export default {
  name: "Properties",
  mounted() {
    fetch("https://my-json-server.typicode.com/pedroskakum/fake-api/grower")
      .then(response => response.json())
      .then(data => {
        this.growers = data;

        fetch(
          "https://my-json-server.typicode.com/pedroskakum/fake-api/properties"
        )
          .then(response => response.json())
          .then(data => {
            this.data = data.map(prop => ({
              grower: this.growers.find(g => g.id === prop.growerId)["name"],
              ...prop
            }));
          });
      });
  },
  methods: {
    async editProperty(property) {
      const { grower, id, ...initialState } = property;

      await this.$forms.open(ReactiveForm, {
        header: "Editar property",
        initialState,
        schema: state => {
          return [
            {
              label: "Dados Básicos",
              fields: [
                {
                  name: "name",
                  label: "Nome",
                  type: "text",
                  hint: "Nome da property"
                },
                {
                  name: "total_area",
                  label: "Área Total",
                  type: "number",
                },
                {
                  name: "city",
                  label: "Cidade",
                  type: "text"
                },
                {
                  name: "growerId",
                  label: "Grower",
                  type: "select",
                  options: this.growers.map(grower => ({
                    value: grower.id,
                    label: grower.name
                  }))
                }
              ]
            }
          ];
        },
        save: newState => {
          return fetch(
            `https://my-json-server.typicode.com/pedroskakum/fake-api/properties/${id}`,
            {
              method: "PATCH",
              body: JSON.stringify(newState)
            }
          ).then(response => {
            this.$notifications.add({
              message: "Property editada com successo!",
              intent: "success",
              icon: "fas fa-check-circle"
            });
          });
        }
      });
    },
    async deleteMany(keys) {
      await Promise.all(
        keys.map(id =>
          fetch(
            `https://my-json-server.typicode.com/pedroskakum/fake-api/properties/${id}`,
            {
              method: "DELETE"
            }
          ).then(response => {
            this.$notifications.add({
              message: `Property ${id} deletada com successo!`,
              intent: "success",
              icon: "fas fa-trash"
            });
          })
        )
      );
    },
    async deleteProperty(grower) {
      return fetch(
        `https://my-json-server.typicode.com/pedroskakum/fake-api/grower/${
          grower.id
        }`,
        {
          method: "DELETE"
        }
      ).then(response => {
        this.$notifications.add({
          message: `Property deletada com successo!`,
          intent: "success",
          icon: "fas fa-trash"
        });
      });
    }
  },
  data() {
    return {
      data: [],
      growers: [],
      columns: [
        {
          id: "id",
          field: "id",
          label: "Id",
          type: "text",
          visible: true
        },
        {
          id: "name",
          field: "name",
          label: "Nome",
          type: "text",
          visible: true
        },
        {
          id: "total_area",
          field: "total_area",
          label: "Área Total",
          type: "number",
          visible: true
        },
        {
          id: "city",
          field: "city",
          label: "Cidade",
          type: "text",
          visible: true
        },
        {
          id: "grower",
          field: "grower",
          label: "Grower",
          type: "grower",
          visible: true
        }
      ]
    };
  }
};
</script>
