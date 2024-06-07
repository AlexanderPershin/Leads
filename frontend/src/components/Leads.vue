<script setup lang="ts">
import axios from "axios";
import moment from "moment";
import { ref, onMounted, watch } from "vue";
import { Button } from "ant-design-vue";
import type { TableProps } from "ant-design-vue";
import { usePagination } from "vue-request";
import { computed } from "vue";
const ButtonGroup = Button.Group;

const search = ref<string>("");

const leads = ref<Lead[]>([]);

const loading = ref<boolean>(false);

const columns = [
    {
        title: "ID",
        dataIndex: "id",
    },
    {
        title: "Name",
        dataIndex: "name",
        width: "20%",
    },
    {
        title: "Price",
        dataIndex: "price",
        width: "20%",
    },
    {
        title: "Status",
        dataIndex: ["status", "name"],
        width: "20%",
        key: "status",
    },
    {
        title: "Responsible",
        dataIndex: ["responsible_user", "name"],
        width: "20%",
        key: "user",
    },
    {
        title: "Created",
        dataIndex: "created_at",
        width: "20%",
        customRender: (text, record, index) => {
            return moment.unix(text.value).format("DD.MM.YYYY HH:mm:ss");
        },
    },
];

type APIParams = {
    page?: number;
    limit?: number;
    query?: string;
    [key: string]: any;
};

type Lead = {
    id: number;
    name: string;
    price: number;
    responsible_user_id: number;
    group_id: number;
    status_id: number;
    pipeline_id: number;
    loss_reason_id: number | null;
    created_by: number;
    updated_by: number;
    created_at: number;
    updated_at: number;
    closed_at: number | null;
    closest_task_at: null;
    is_deleted: boolean;
    custom_fields_values: any;
    score: any;
    account_id: number;
    labor_cost: any;
    _links: {
        self: {
            href: string;
        };
    };
    _embedded: {
        tags: any[];
        companies: [
            {
                id: number;
                _links: {
                    self: {
                        href: string;
                    };
                };
            }
        ];
    };
};

type APIResult = {
    results: {
        _page: number;
        _links: {
            self: {
                href: string;
            };
        };
        _embedded: {
            leads: Lead[];
        };
    }[];
};

const fetchLeads = async (params: APIParams) => {
    try {
        loading.value = true;
        const url = `${import.meta.env.VITE_BASE_URL}/api/leads`;
        const res = await axios.get<APIResult>(url, { params });
        leads.value = res.data._embedded.leads;
        loading.value = false;
    } catch (error) {
        leads.value = [];
        loading.value = false;
    }
};

onMounted(() => {
    fetchLeads({ page: 1, limit: 1000, query: "" });
});

const handleSearch = (val: any) => {
    if (val.length > 3) {
        fetchLeads({ page: 1, limit: 1000, query: val });
    } else {
        fetchLeads({ page: 1, limit: 1000, query: "" });
    }
};
</script>

<template>
    <a-card :loading="loading" title="Leads">
        <template #extra>
            <a-input-search
                v-model:value="search"
                placeholder="Search"
                style="width: 200px"
                @search="handleSearch"
                enter-button
                :disabled="loading"
                :loading="loading"
            />
        </template>
        <a-table
            :columns="columns"
            :data-source="leads"
            :loading="loading"
            :pagination="false"
        >
            <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'status'">
                    <a-tag :color="record.status.color" class="color-black">
                        {{ record.status.name }}
                    </a-tag>
                </template></template
            >
        </a-table>
    </a-card>
</template>

<style scoped>
.color-black {
    color: var(--surely-table-text-color) !important;
}
</style>
