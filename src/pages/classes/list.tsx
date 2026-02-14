import ActionButton from "@/components/actionButton";
import { CreateButton } from "@/components/refine-ui/buttons/create";
import { DeleteButton } from "@/components/refine-ui/buttons/delete";
import { ShowButton } from "@/components/refine-ui/buttons/show";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { DataTableFilterCombobox } from "@/components/refine-ui/data-table/data-table-filter";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { ListView } from "@/components/refine-ui/views/list-view";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Subject, User } from "@/types";
import { SelectValue } from "@radix-ui/react-select";
import { useList } from "@refinedev/core";
import { useTable } from "@refinedev/react-table";
import { ColumnDef } from "@tanstack/table-core";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";

interface ClassRecord {
  id: number;
  name: string;
  bannerUrl?: string | null;
  inviteCode: string;
  description?: string;
  capacity: number;
  status: "active" | "inactive" | "archived";
  subject: Subject & { id: number; name: string; code: string };
  teacher: User & { id: string; name: string };
  createdAt: string;
}

const ClassesList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedTeacher, setSelectedTeacher] = useState("all");

  const subjectFilter =
    selectedSubject === "all"
      ? []
      : [
          {
            field: "subject.id",
            operator: "eq" as const,
            value: selectedSubject,
          },
        ];

  const teacherFilter =
    selectedTeacher === "all"
      ? []
      : [
          {
            field: "teacher.id",
            operator: "eq" as const,
            value: selectedTeacher,
          },
        ];

  const searchFilter = searchQuery
    ? [
        {
          field: "name",
          operator: "contains" as const,
          value: searchQuery,
        },
      ]
    : [];

  const { query: subjectsQuery } = useList<Subject>({
    resource: "subjects",
    pagination: {
      pageSize: 1000,
    },
  });

  const { query: teachersQuery } = useList<User>({
    resource: "users",
    filters: [
      {
        field: "role",
        operator: "eq" as const,
        value: "teacher",
      },
    ],
    pagination: {
      pageSize: 1000,
    },
  });

  const subjects = useMemo(
    () => subjectsQuery?.data?.data ?? [],
    [subjectsQuery?.data?.data],
  );
  const subjectsLoading = subjectsQuery?.isLoading ?? false;

  const teachers = useMemo(
    () => teachersQuery?.data?.data ?? [],
    [teachersQuery?.data?.data],
  );
  const teachersLoading = teachersQuery?.isLoading ?? false;

  const classTable = useTable<ClassRecord>({
    columns: useMemo<ColumnDef<ClassRecord>[]>(
      () => [
        {
          id: "bannerUrl",
          accessorKey: "bannerUrl",
          size: 80,
          header: () => <p className="column-title ml-2">Banner</p>,
          cell: ({ getValue }) => {
            const url = getValue<string>();
            return url ? (
              <div className="flex items-center justify-center ml-2">
                <img
                  src={url}
                  alt="Class banner"
                  className="w-10 h-10 object-cover rounded"
                />
              </div>
            ) : (
              <div className="w-16 h-10 bg-muted rounded" />
            );
          },
        },
        {
          id: "name",
          accessorKey: "name",
          size: 200,
          header: () => <p className="column-title">Class Name</p>,
          cell: ({ getValue }) => (
            <span className="text-foreground font-medium">
              {getValue<string>()}
            </span>
          ),
          filterFn: "includesString",
        },
        {
          id: "status",
          accessorKey: "status",
          size: 120,
          header: () => <p className="column-title">Status</p>,
          cell: ({ getValue }) => {
            const status = getValue<string>();
            const statusVariant =
              status === "active"
                ? "default"
                : status === "inactive"
                ? "secondary"
                : "outline";
            return <Badge variant={statusVariant}>{status}</Badge>;
          },
        },
        {
          id: "subject",
          accessorKey: "subject.name",
          size: 150,
          header: ({ column }) => (
            <div className="flex items-center gap-1">
              <span>Subject</span>
              <DataTableFilterCombobox
                column={column}
                defaultOperator="eq"
                options={
                  subjects?.map(
                    ({ id, name }: { id: number; name: string }) => ({
                      label: name,
                      value: String(id),
                    }),
                  ) || []
                }
                placeholder="Filter by subject"
              />
            </div>
          ),
          cell: ({ getValue }) => (
            <Badge variant="secondary">{getValue<string>()}</Badge>
          ),
        },
        {
          id: "teacher",
          accessorKey: "teacher.name",
          size: 150,
          header: ({ column }) => (
            <div className="flex items-center gap-1">
              <span>Teacher</span>
              <DataTableFilterCombobox
                column={column}
                defaultOperator="eq"
                options={
                  teachers?.map(
                    ({ id, name }: { id: string; name: string }) => ({
                      label: name,
                      value: id,
                    }),
                  ) || []
                }
                placeholder="Filter by teacher"
              />
            </div>
          ),
          cell: ({ getValue }) => (
            <span className="text-foreground">{getValue<string>()}</span>
          ),
        },
        {
          id: "capacity",
          accessorKey: "capacity",
          size: 100,
          header: () => <p className="column-title">Capacity</p>,
          cell: ({ getValue }) => (
            <span className="text-foreground">{getValue<number>()}</span>
          ),
        },
        {
          id: 'actions',
          size: 140,
          header: () => <p className="column-title">Actions</p>,
          cell: ({ row }) => {
            return (
              <div className="flex items-center gap-2">
                <ShowButton resource="classes" recordItemId={row.original.id} variant="outline" size="sm">
                  <ActionButton type="view" />
                </ShowButton>
                <DeleteButton resource="classes" recordItemId={row.original.id} variant="outline" size="sm" className="cursor-pointer">
                  <ActionButton type="delete" />
                </DeleteButton>
              </div>
          );
          },
        },
      ],
      [subjects, teachers],
    ),
    refineCoreProps: {
      resource: "classes",
      pagination: { pageSize: 10, mode: "server" },
      filters: {
        permanent: [...subjectFilter, ...teacherFilter, ...searchFilter],
      },
      sorters: {
        initial: [{ field: "id", order: "desc" }],
      },
    },
  });

  return (
    <ListView>
      <Breadcrumb />

      <h1 className="page-title">Classes</h1>

      <div className="intro-row">
        <p>Manage your classes, subjects and teachers.</p>

        <div className="actions-row">
          <div className="search-field">
            <Search className="search-icon" />

            <Input
              type="text"
              placeholder="Search by class name"
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2 w-full sm:w-auto flex-wrap">
            <Select
              value={selectedSubject}
              onValueChange={setSelectedSubject}
              disabled={subjectsLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by subject" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {subjects?.map(({ id, name }: { id: number; name: string }) => (
                  <SelectItem key={id} value={String(id)}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectedTeacher}
              onValueChange={setSelectedTeacher}
              disabled={teachersLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by teacher" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Teachers</SelectItem>
                {teachers?.map(({ id, name }: { id: string; name: string }) => (
                  <SelectItem key={id} value={id}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <CreateButton />
          </div>
        </div>
      </div>

      <DataTable table={classTable} />
    </ListView>
  );
};

export default ClassesList;
