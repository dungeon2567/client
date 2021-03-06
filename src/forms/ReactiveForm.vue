<script>
import Overlay from "@/components/Overlay.vue";
import Button from "@/components/Button.vue";
import TextInput from "@/components/TextInput.vue";
import DateInput from "@/components/DateInput.vue";
import RichTextInput from "@/components/RichTextInput.vue";
import Radio from "@/components/Radio.vue";
import InnerLoading from "@/components/InnerLoading.vue";
import Suggest from "@/components/Suggest.vue";
import MultipleSuggest from "@/components/MultipleSuggest.vue";
import NumberInput from "../components/NumberInput.vue";

export default {
  props: {
    accept: {
      type: Function,
      required: true
    },
    reject: {
      type: Function,
      required: true
    },
    schema: {
      type: Function,
      required: true
    },
    initialState: {
      type: Object,
      required: false
    },
    save: {
      type: Function,
      required: true
    },
    header: {
      type: String
    }
  },
  methods: {
    transformState() {
      const result = {};

      for (const group of this.formSchema) {
        for (const field of group.fields) {
          switch (field.type) {
            case "text":
              result[field.name] = this.state[field.name];
              break;
            case "number":
              result[field.name] = this.state[field.name];
              break;
            case "date":
              result[field.name] = this.state[field.name];
              break;
            case "select":
              if (field.multiple) {
                result[field.name] = this.state[field.name].map(
                  option => option.value
                );
              } else {
                const option = this.state[field.name];

                result[field.name] = option ? option.value : null;
              }
              break;
          }
        }
      }

      return result;
    },
    async handleSaveClick() {
      this.validate();

      for (var e in this.errors) {
        if (this.errors.hasOwnProperty(e)) {
          return;
        }
      }

      this.loading = true;

      try {
        await this.accept(await this.save(this.transformState()));
      } catch (err) {
        for (var e in err) {
          if (err.hasOwnProperty(e)) {
            if (this.errors.hasOwnProperty(e)) {
              let errorList = this.errors[e];

              errorList.push(err[e]);
            } else {
              this.$set(this.errors, e, [err[e]]);
            }
          }
        }
      } finally {
        this.loading = false;
      }
    },
    validate() {
      let errors = {};

      for (let group of this.formSchema) {
        for (let field of group.fields) {
          let errorList = [];

          switch (field.type) {
            case "date":
              if (!field.optional && !this.state[field.name]) {
                errorList.push(`${field.label} é obrigatório`);
              }

              break;
            case "text":
              if (!field.optional && !this.state[field.name]) {
                errorList.push(`${field.label} é obrigatório`);
              }

              break;
            case "select":
              if (!field.optional && this.state[field.name] == null) {
                errorList.push(`${field.label} é obrigatório`);
              }
              break;

            case "html":
              if (!field.optional && this.state[field.name] == null) {
                errorList.push(`${field.label} é obrigatório`);
              }
              break;
          }

          if (errorList.length > 0) errors[field.name] = errorList;
        }
      }

      this.errors = errors;
    },
    renderFieldInput(field) {
      switch (field.type) {
        case "date":
          return (
            <DateInput
              onFocus={() => this.$delete(this.errors, field.name)}
              onInput={val => this.$set(this.state, field.name, val)}
              value={this.state[field.name]}
            />
          );
        case "number": {
          return (
            <NumberInput
              clearable={!field.optional}
              onFocus={() => this.$delete(this.errors, field.name)}
              onInput={val => this.$set(this.state, field.name, val)}
              value={this.state[field.name]}
            />
          );
        }
        case "text": {
          const directives = field.mask
            ? [
                {
                  name: "mask",
                  value: field.mask
                }
              ]
            : [];

          return (
            <TextInput
              {...{ directives }}
              onFocus={() => this.$delete(this.errors, field.name)}
              onInput={val => this.$set(this.state, field.name, val)}
              value={this.state[field.name]}
            />
          );
        }
        case "select":
          return field.options.length < 4 ? (
            <div class="button-group">
              {field.multiple
                ? field.options.map(option => {
                    return (
                      <Button
                        class={{
                          primary: this.state[field.name].some(
                            item => item.value === option.value
                          )
                        }}
                        onFocus={() => this.$delete(this.errors, field.name)}
                        onClick={() => {
                          let index = this.state[field.name].findIndex(
                            item => item.value === option.value
                          );

                          if (index === -1) {
                            this.state[field.name].push(option);
                          } else {
                            this.state[field.name].splice(index, 1);
                          }
                        }}
                      >
                        {option.label}
                      </Button>
                    );
                  })
                : field.options.map(option => {
                    return (
                      <Button
                        class={{
                          primary: this.state[field.name] === option.value
                        }}
                        onFocus={() => this.$delete(this.errors, field.name)}
                        onClick={() =>
                          this.$set(this.state, field.name, option.value)
                        }
                      >
                        {option.label}
                      </Button>
                    );
                  })}
            </div>
          ) : field.multiple ? (
            <MultipleSuggest
              value={this.state[field.name]}
              onFocus={() => this.$delete(this.errors, field.name)}
              onInput={val => this.$set(this.state, field.name, val.value)}
              search={query =>
                field.options.filter(
                  option =>
                    option.label
                      .substring(0, query.length)
                      .localeCompare(query, "pt-BR", {
                        usage: "search",
                        sensitivity: "base"
                      }) === 0
                )
              }
            />
          ) : (
            <Suggest
              value={this.state[field.name]}
              onFocus={() => this.$delete(this.errors, field.name)}
              onInput={val => this.$set(this.state, field.name, val)}
              search={query =>
                field.options.filter(
                  option =>
                    option.label
                      .substring(0, query.length)
                      .localeCompare(query, "pt-BR", {
                        usage: "search",
                        sensitivity: "base"
                      }) === 0
                )
              }
            />
          );
          break;
        case "html":
          return (
            <RichTextInput
              key={field.name}
              onFocus={() => this.$delete(this.errors, field.name)}
              onInput={val => this.$set(this.state, field.name, val)}
              value={this.state[field.name] || ""}
            />
          );
          break;
        default:
          return field.multiple ? (
            <MultipleSuggest
              value={this.state[field.name]}
              onFocus={() => this.$delete(this.errors, field.name)}
              onInput={val => this.$set(this.state, field.name, val.value)}
              search={query => this.fetch(field, query)}
            />
          ) : (
            <Suggest
              value={this.state[field.name]}
              onFocus={() => this.$delete(this.errors, field.name)}
              onInput={val => this.$set(this.state, field.name, val)}
              search={query => this.fetch(field, query)}
            />
          );
          break;
      }
    },
    fetch(field, query) {
      if (this.abortControllers[field.name] != null) {
        this.abortControllers[field.name].abort();
      }

      const controller = new AbortController();

      this.abortControllers[field.name] = controller;

      return fetch(
        `http://localhost:3000/${field.type}/autocomplete/${encodeURIComponent(
          query
        )}`,
        {
          method: "GET",
          signal: controller.signal
        }
      )
        .then(response => response.json())
        .then(json => {
          this.abortControllers[field.name] = null;

          return json;
        });
    },
    renderHintOrError(field) {
      if (this.errors[field.name]) {
        return (
          <div class="field-bottom">
            {this.errors[field.name].map(error => {
              return <div class="field-error">{error}</div>;
            })}
          </div>
        );
      } else if (field.hint) {
        return <div class="field-bottom field-hint">{field.hint}</div>;
      } else return null;
    },
    renderFormGroup(group) {
      return group.fields.map(field => {
        return (
          <div
            class={`form-field ${field.type}${
              field.type === "select" && field.options < 4 ? " small" : ""
            }`}
            key={field.name}
          >
            <label>{field.label}</label>
            <div>
              {this.renderFieldInput(field)}
              {this.renderHintOrError(field)}
            </div>
          </div>
        );
      });
    }
  },
  render(h) {
    return (
      <Overlay
        onClose={() => {
          this.reject();
        }}
        scopedSlots={{
          header: () => this.header,
          body: () => {
            return this.formSchema.map(group => {
              return (
                <div class="form-group">
                  <label>{group.label}</label>
                  <div class="divider vertical" />
                  {this.renderFormGroup(group)}
                </div>
              );
            });
          },
          footer: () => [
            <Button onClick={() => this.reject("kkk")}>Cancelar</Button>,
            <Button onClick={this.handleSaveClick} class="primary">
              Salvar
            </Button>
          ],
          default: () => <InnerLoading visible={this.loading} />
        }}
      />
    );
  },
  computed: {
    formSchema() {
      return this.schema(this.state);
    }
  },
  created() {
    this.state = this.initialState || {};
  },
  data() {
    return {
      loading: false,
      errors: {},
      abortControllers: {},
      state: null
    };
  }
};
</script>
