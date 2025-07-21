import React from 'react';
import {
  Form,
  Input,
  Select,
  Button,
  Card,
  Space,
  Typography,
  Divider,
} from 'antd';
import { Controller, useForm, useFieldArray } from 'react-hook-form';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

const { Text } = Typography;

type FieldType = 'String' | 'Number' | 'Float' | 'Boolean' | 'ObjectId' | 'Nested';

interface Field {
  name: string;
  type: FieldType;
  children?: Field[];
}

interface SchemaForm {
  fields: Field[];
}

const defaultField: Field = { name: '', type: 'String' };

const fieldTypeOptions = [
  { label: 'String', value: 'String' },
  { label: 'Number', value: 'Number' },
  { label: 'Float', value: 'Float' },
  { label: 'Boolean', value: 'Boolean' },
  { label: 'ObjectId', value: 'ObjectId' },
  { label: 'Nested', value: 'Nested' },
];

const FieldRow: React.FC<{
  nestPath: string;
  control: any;
  register: any;
  remove: (index: number) => void;
  fields: any[];
  field: any;
  index: number;
}> = ({ nestPath, control, register, remove, fields, field, index }) => {
  const currentPath = `${nestPath}[${index}]`;
  const {
    fields: childFields,
    append: appendChild,
    remove: removeChild,
  } = useFieldArray({
    control,
    name: `${currentPath}.children`,
  });

  return (
    <Card
      size="small"
      style={{
        marginBottom: 12,
        backgroundColor: '#ffffff',
        borderRadius: 8,
        boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
      }}
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <Space wrap align="baseline">
          <Input
            placeholder="Field Name"
            {...register(`${currentPath}.name` as const)}
            style={{ width: 220 }}
          />
          <Controller
            control={control}
            name={`${currentPath}.type`}
            render={({ field }) => (
              <Select
                {...field}
                style={{ width: 160 }}
                options={fieldTypeOptions}
              />
            )}
          />
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => remove(index)}
          />
        </Space>

        {fields[index]?.type === 'Nested' && (
          <div
            style={{
              marginTop: 12,
              paddingLeft: 24,
              borderLeft: '3px solid #f0f0f0',
            }}
          >
            <Text type="secondary">Nested Fields:</Text>
            {childFields.map((child, childIndex) => (
              <FieldRow
                key={child.id}
                nestPath={`${currentPath}.children`}
                control={control}
                register={register}
                remove={removeChild}
                fields={childFields}
                field={child}
                index={childIndex}
              />
            ))}
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              onClick={() =>
                appendChild({
                  name: '',
                  type: 'String',
                })
              }
              block
              style={{ marginTop: 8 }}
            >
              Add Nested Field
            </Button>
          </div>
        )}
      </Space>
    </Card>
  );
};

const SchemaBuilder: React.FC = () => {
  const { control, handleSubmit, register, watch } = useForm<SchemaForm>({
    defaultValues: {
      fields: [defaultField],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'fields',
  });

  const onSubmit = (data: SchemaForm) => {
    console.log('Schema:', data);
  };

  const watchAll = watch();

  return (
    <div
      style={{
        padding: 32,
        maxWidth: 900,
        margin: '0 auto',
        backgroundColor: '#f9fafb',
        minHeight: '100vh',
      }}
    >
      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        <Text strong style={{ fontSize: 22 }}>
          JSON Schema Builder
        </Text>
        <Divider />

        {fields.map((field, index) => (
          <FieldRow
            key={field.id}
            nestPath="fields"
            control={control}
            register={register}
            remove={remove}
            fields={fields}
            field={field}
            index={index}
          />
        ))}

        <Form.Item>
          <Button
            type="dashed"
            icon={<PlusOutlined />}
            onClick={() => append(defaultField)}
            block
            style={{ marginTop: 12 }}
          >
            Add Field
          </Button>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Save Schema
          </Button>
        </Form.Item>
      </Form>

      <Divider />
      <Text strong style={{ fontSize: 16 }}>Live JSON Preview:</Text>
      <pre
        style={{
          background: '#fff',
          padding: 16,
          borderRadius: 8,
          boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
          overflow: 'auto',
        }}
      >
        {JSON.stringify(watchAll.fields, null, 2)}
      </pre>
    </div>
  );
};

export default SchemaBuilder;
