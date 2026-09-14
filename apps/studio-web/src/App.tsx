import {
  Badge,
  Box,
  ColorSwatch,
  Container,
  Group,
  Paper,
  Select,
  SimpleGrid,
  Stack,
  Table,
  Text,
  TextInput,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { useMemo, useState } from 'react';
import studioData from './generated/studio-data.json';

function isHexColor(value: unknown): value is string {
  return typeof value === 'string' && /^#[0-9a-f]{6}$/i.test(value);
}

export default function App() {
  const [projectName, setProjectName] = useState<string | null>(studioData.projects[0]?.name ?? null);
  const [query, setQuery] = useState('');
  const project = studioData.projects.find((item) => item.name === projectName) ?? studioData.projects[0];

  const tokens = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!project || !normalized) return project?.tokens ?? [];
    return project.tokens.filter((token) => token.id.toLowerCase().includes(normalized));
  }, [project, query]);

  const semanticCount = project?.tokens.filter((token) => token.semantic).length ?? 0;
  const overriddenCount = project?.tokens.filter((token) => token.source === 'project').length ?? 0;

  return (
    <Box className="studio-shell">
      <Container size="xl" py="xl">
        <Stack gap="lg">
          <Group justify="space-between" align="flex-end">
            <Box>
              <Group gap="xs" mb={6}>
                <Badge variant="light">Phase 0.5</Badge>
                <Badge variant="outline">Read only</Badge>
              </Group>
              <Title order={1}>Git-backed Studio</Title>
              <Text c="dimmed">Inspect resolved design contracts without creating a second source of truth.</Text>
            </Box>
            <Select
              label="Project"
              value={projectName}
              onChange={setProjectName}
              data={studioData.projects.map((item) => ({ value: item.name, label: item.name }))}
              w={220}
            />
          </Group>

          {project && (
            <SimpleGrid cols={{ base: 1, sm: 3 }}>
              <Paper withBorder p="md">
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>Inheritance</Text>
                <Text fw={700} mt={4}>{project.extends}</Text>
                <Text size="sm" c="dimmed">release {project.releaseVersion}</Text>
              </Paper>
              <Paper withBorder p="md">
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>Semantic contract</Text>
                <Text fw={700} mt={4}>{semanticCount} frozen names</Text>
                <Text size="sm" c="dimmed">Shared across every project</Text>
              </Paper>
              <Paper withBorder p="md">
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>Project diff</Text>
                <Text fw={700} mt={4}>{overriddenCount} primitive overrides</Text>
                <Text size="sm" c="dimmed">Everything else inherits base</Text>
              </Paper>
            </SimpleGrid>
          )}

          <Paper withBorder p="lg">
            <Group justify="space-between" mb="md" align="flex-end">
              <Box>
                <Title order={2} size="h3">Resolved tokens</Title>
                <Text size="sm" c="dimmed">Base include → project source override → resolved value → generated usage index.</Text>
              </Box>
              <TextInput
                label="Filter token"
                placeholder="color.primary"
                value={query}
                onChange={(event) => setQuery(event.currentTarget.value)}
                w={260}
              />
            </Group>

            <Table.ScrollContainer minWidth={900}>
              <Table striped highlightOnHover verticalSpacing="sm">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Token</Table.Th>
                    <Table.Th>Resolved value</Table.Th>
                    <Table.Th>Layer</Table.Th>
                    <Table.Th>Blast radius</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {tokens.map((token) => (
                    <Table.Tr key={token.id}>
                      <Table.Td>
                        <Text fw={600} ff="monospace">{token.id}</Text>
                        <Text size="xs" c="dimmed">{token.sourcePath}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Group gap="xs" wrap="nowrap">
                          {isHexColor(token.value) && <ColorSwatch color={token.value} size={22} />}
                          <Text ff="monospace" size="sm">{String(token.value)}</Text>
                        </Group>
                      </Table.Td>
                      <Table.Td>
                        <Group gap={6}>
                          <Badge variant={token.semantic ? 'filled' : 'light'}>{token.semantic ? 'semantic' : 'primitive'}</Badge>
                          <Badge variant="outline">{token.source}</Badge>
                        </Group>
                      </Table.Td>
                      <Table.Td>
                        {token.usage ? (
                          <Group gap={6}>
                            <Badge variant="light">{token.usage.components.length} components</Badge>
                            <Badge variant="light">{token.usage.forms.length} forms</Badge>
                            <Badge variant="light">{token.usage.pages.length} pages</Badge>
                            <ThemeIcon variant="light" size="sm" radius="xl">{token.usage.total}</ThemeIcon>
                          </Group>
                        ) : <Text size="sm" c="dimmed">No referenced surfaces</Text>}
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Table.ScrollContainer>
          </Paper>

          <Text size="sm" c="dimmed" ta="center">
            Editing, commits, rollback and AI proposal branches intentionally begin in Phase 1/2.
          </Text>
        </Stack>
      </Container>
    </Box>
  );
}
