import React, { Component } from "react";
import { FaGithubAlt, FaPlus, FaSpinner, FaTrash } from "react-icons/fa";
import api from "../../sevices/api";
import Container from "../../Components/Container/index";
import { Form, SubmitButton, List, FaTrashButton } from "./styles";
import { Link } from "react-router-dom";

export default class Main extends Component {
  state = {
    newRepo: "",
    repositories: [],
    loading: false,
    error: null
  };

  componentDidMount() {
    const repositories = localStorage.getItem("repositories");

    if (repositories) {
      this.setState({ repositories: JSON.parse(repositories) });
    }
  }

  componentDidUpdate(_, prevState) {
    const { repositories } = this.state;

    if (prevState.repositories !== this.state.repositories) {
      localStorage.setItem("repositories", JSON.stringify(repositories));
    }
  }

  handleInputChange = e => {
    this.setState({ newRepo: e.target.value, error: null });
  };
  handleSubmit = async e => {
    e.preventDefault();

    this.setState({ loading: true, error: false });

    try {
      const { newRepo, repositories } = this.state;

      if (newRepo === "") throw "Você precisa indicar um repositório";

      const hasRepo = repositories.find(r => r.name === newRepo);

      if (hasRepo) throw "Repositório duplicado";

      const response = await api.get(`repos/${newRepo}`);

      const data = {
        name: response.data.full_name
      };

      this.setState({
        repositories: [...repositories, data],
        newRepo: ""
      });
    } catch (error) {
      this.setState({ error: true });
    } finally {
      this.setState({ loading: false });
    }
  };

  handleDelete = repositories => {
    this.setState({
      repositories: this.state.repositories.filter(t => t !== repositories)
    });
  };

  render() {
    const { newRepo, repositories, loading, error } = this.state;

    return (
      <Container>
        <h1>
          <FaGithubAlt />
          Repositórios
        </h1>

        <Form onSubmit={this.handleSubmit} error={error}>
          <input
            errorRepo={error}
            type="text"
            placeholder="adicionar repositorios"
            value={newRepo}
            onChange={this.handleInputChange}
          />
          <SubmitButton loading={loading}>
            {loading ? (
              <FaSpinner color="#fff" size={14} />
            ) : (
              <FaPlus color="#fff" size={14} />
            )}
          </SubmitButton>
        </Form>

        <List>
          {repositories.map(repository => (
            <li key={repository.name}>
              <span>{repository.name}</span>
              <span className="span">
                <Link to={`repository/${encodeURIComponent(repository.name)}`}>
                  Detalhes
                </Link>
                <FaTrashButton onClick={() => this.handleDelete(repository)}>
                  <FaTrash />
                </FaTrashButton>
              </span>
            </li>
          ))}
        </List>
      </Container>
    );
  }
}
