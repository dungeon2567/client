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
          @click="editGrower(row)"
        >
          <i class="fas fa-pen icon" />
          <Popover
            class="tooltip"
            placement="bottom"
            appendToBody
          >
            <div style="width: 100px">
              Clique para editar o grower '
              <b>{{row.name}}</b>''
            </div>
          </Popover>
        </Button>
        <Button
          class="small danger"
          @click="deleteGrower(row)"
        >
          <i class="fas fa-trash icon" />
          <Popover
            class="tooltip"
            placement="bottom"
            appendToBody
          >
            <div style="width: 100px">
              Clique para deletar o grower '
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
  name: "Grower",
  mounted() {
    fetch("https://my-json-server.typicode.com/pedroskakum/fake-api/grower")
      .then(response => response.json())
      .then(data => {
        this.data = data;
      });
  },
  methods: {
    async editGrower(grower) {
      const initialState = await fetch(
        "http://localhost:3000/book/50/?fields=id&fields=title&fields=author"
      ).then(response => response.json());

      var data = await this.$forms.open(ReactiveForm, {
        header: "Editar grower",
        initialState,
        schema: state => {
          return [
            {
              label: "Dados Básicos",
              fields: [
                {
                  name: "title",
                  label: "Título",
                  type: "text"
                },
                {
                  name: "author",
                  label: "Author",
                  type: "author",        
                }
              ]
            }
          ];
        },
        save: newState => {
          return fetch(
            `https://my-json-server.typicode.com/pedroskakum/fake-api/grower/${id}`,
            {
              method: "PATCH",
              body: JSON.stringify(newState)
            }
          ).then(response => {
            this.$notifications.add({
              message: "Grower editado com sucesso!",
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
            `https://my-json-server.typicode.com/pedroskakum/fake-api/grower/${id}`,
            {
              method: "DELETE"
            }
          ).then(response => {
            this.$notifications.add({
              message: `Grower ${id} deletado com successo!`,
              intent: "success",
              icon: "fas fa-trash"
            });
          })
        )
      );
    },
    async deleteGrower(grower) {
      return fetch(
        `https://my-json-server.typicode.com/pedroskakum/fake-api/grower/${
          grower.id
        }`,
        {
          method: "DELETE"
        }
      ).then(response => {
        this.$notifications.add({
          message: `Grower deletado com successo!`,
          intent: "success",
          icon: "fas fa-trash"
        });
      });
    }
  },
  data() {
    return {
      data: [],
      columns: [
        {
          id: "id",
          field: "id",
          label: "Id",
          type: "text",
          multiple: false,
          visible: true
        },
        {
          id: "name",
          field: "name",
          label: "Nome",
          type: "text",
          multiple: false,
          visible: true
        },
        {
          id: "cpf",
          field: "cpf",
          label: "CPF",
          type: "text",
          multiple: false,
          visible: true,
          rules: [val => val.length === 0 && "O Campo CPF é obrigatório"]
        }
      ]
    };
  }
};
</script>
