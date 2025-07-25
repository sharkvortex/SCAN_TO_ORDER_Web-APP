PGDMP  *    9                }            ScanToOrder    16.9 (Debian 16.9-1.pgdg120+1)    16.9 6    a           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            b           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            c           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            d           1262    16384    ScanToOrder    DATABASE     x   CREATE DATABASE "ScanToOrder" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';
    DROP DATABASE "ScanToOrder";
                root    false                        2615    41180    public    SCHEMA     2   -- *not* creating schema, since initdb creates it
 2   -- *not* dropping schema, since initdb creates it
                root    false            e           0    0    SCHEMA public    COMMENT         COMMENT ON SCHEMA public IS '';
                   root    false    5            f           0    0    SCHEMA public    ACL     +   REVOKE USAGE ON SCHEMA public FROM PUBLIC;
                   root    false    5            [           1247    41208    OrderStatus    TYPE     l   CREATE TYPE public."OrderStatus" AS ENUM (
    'PENDING',
    'CONFIRMED',
    'SERVED',
    'CANCELLED'
);
     DROP TYPE public."OrderStatus";
       public          root    false    5            X           1247    41200    SessionStatus    TYPE     [   CREATE TYPE public."SessionStatus" AS ENUM (
    'PENDING',
    'PAID',
    'CANCELLED'
);
 "   DROP TYPE public."SessionStatus";
       public          root    false    5            U           1247    41193    Status    TYPE     Y   CREATE TYPE public."Status" AS ENUM (
    'AVAILABLE',
    'OCCUPIED',
    'RESERVED'
);
    DROP TYPE public."Status";
       public          root    false    5            �            1259    41228    Category    TABLE     �   CREATE TABLE public."Category" (
    id integer NOT NULL,
    name text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);
    DROP TABLE public."Category";
       public         heap    root    false    5            �            1259    41227    Category_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Category_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public."Category_id_seq";
       public          root    false    5    219            g           0    0    Category_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public."Category_id_seq" OWNED BY public."Category".id;
          public          root    false    218            �            1259    41218    Food    TABLE     O  CREATE TABLE public."Food" (
    id integer NOT NULL,
    name text NOT NULL,
    description text,
    "categoryId" integer NOT NULL,
    price double precision NOT NULL,
    "imageUrl" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);
    DROP TABLE public."Food";
       public         heap    root    false    5            �            1259    41217    Food_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Food_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 $   DROP SEQUENCE public."Food_id_seq";
       public          root    false    217    5            h           0    0    Food_id_seq    SEQUENCE OWNED BY     ?   ALTER SEQUENCE public."Food_id_seq" OWNED BY public."Food".id;
          public          root    false    216            �            1259    41260    Order    TABLE     �  CREATE TABLE public."Order" (
    id integer NOT NULL,
    "orderSessionId" integer NOT NULL,
    "foodId" integer NOT NULL,
    "foodName" text NOT NULL,
    "foodPrice" double precision NOT NULL,
    status public."OrderStatus" DEFAULT 'PENDING'::public."OrderStatus" NOT NULL,
    quantity integer NOT NULL,
    note text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);
    DROP TABLE public."Order";
       public         heap    root    false    859    5    859            �            1259    41249    OrderSession    TABLE     c  CREATE TABLE public."OrderSession" (
    id integer NOT NULL,
    "orderId" text NOT NULL,
    "tableNumber" integer NOT NULL,
    status public."SessionStatus" DEFAULT 'PENDING'::public."SessionStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);
 "   DROP TABLE public."OrderSession";
       public         heap    root    false    856    5    856            �            1259    41248    OrderSession_id_seq    SEQUENCE     �   CREATE SEQUENCE public."OrderSession_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ,   DROP SEQUENCE public."OrderSession_id_seq";
       public          root    false    5    223            i           0    0    OrderSession_id_seq    SEQUENCE OWNED BY     O   ALTER SEQUENCE public."OrderSession_id_seq" OWNED BY public."OrderSession".id;
          public          root    false    222            �            1259    41259    Order_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Order_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public."Order_id_seq";
       public          root    false    225    5            j           0    0    Order_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public."Order_id_seq" OWNED BY public."Order".id;
          public          root    false    224            �            1259    41238    Table    TABLE     �  CREATE TABLE public."Table" (
    id integer NOT NULL,
    "tableNumber" integer NOT NULL,
    status public."Status" DEFAULT 'AVAILABLE'::public."Status" NOT NULL,
    capacity integer NOT NULL,
    token text,
    "orderId" text,
    note text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);
    DROP TABLE public."Table";
       public         heap    root    false    853    5    853            �            1259    41237    Table_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Table_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public."Table_id_seq";
       public          root    false    5    221            k           0    0    Table_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public."Table_id_seq" OWNED BY public."Table".id;
          public          root    false    220            �            1259    41181    _prisma_migrations    TABLE     �  CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);
 &   DROP TABLE public._prisma_migrations;
       public         heap    root    false    5            �           2604    41231    Category id    DEFAULT     n   ALTER TABLE ONLY public."Category" ALTER COLUMN id SET DEFAULT nextval('public."Category_id_seq"'::regclass);
 <   ALTER TABLE public."Category" ALTER COLUMN id DROP DEFAULT;
       public          root    false    219    218    219            �           2604    41221    Food id    DEFAULT     f   ALTER TABLE ONLY public."Food" ALTER COLUMN id SET DEFAULT nextval('public."Food_id_seq"'::regclass);
 8   ALTER TABLE public."Food" ALTER COLUMN id DROP DEFAULT;
       public          root    false    216    217    217            �           2604    41263    Order id    DEFAULT     h   ALTER TABLE ONLY public."Order" ALTER COLUMN id SET DEFAULT nextval('public."Order_id_seq"'::regclass);
 9   ALTER TABLE public."Order" ALTER COLUMN id DROP DEFAULT;
       public          root    false    225    224    225            �           2604    41252    OrderSession id    DEFAULT     v   ALTER TABLE ONLY public."OrderSession" ALTER COLUMN id SET DEFAULT nextval('public."OrderSession_id_seq"'::regclass);
 @   ALTER TABLE public."OrderSession" ALTER COLUMN id DROP DEFAULT;
       public          root    false    223    222    223            �           2604    41241    Table id    DEFAULT     h   ALTER TABLE ONLY public."Table" ALTER COLUMN id SET DEFAULT nextval('public."Table_id_seq"'::regclass);
 9   ALTER TABLE public."Table" ALTER COLUMN id DROP DEFAULT;
       public          root    false    221    220    221            X          0    41228    Category 
   TABLE DATA           H   COPY public."Category" (id, name, "createdAt", "updatedAt") FROM stdin;
    public          root    false    219   )?       V          0    41218    Food 
   TABLE DATA           r   COPY public."Food" (id, name, description, "categoryId", price, "imageUrl", "createdAt", "updatedAt") FROM stdin;
    public          root    false    217   �?       ^          0    41260    Order 
   TABLE DATA           �   COPY public."Order" (id, "orderSessionId", "foodId", "foodName", "foodPrice", status, quantity, note, "createdAt", "updatedAt") FROM stdin;
    public          root    false    225   oD       \          0    41249    OrderSession 
   TABLE DATA           h   COPY public."OrderSession" (id, "orderId", "tableNumber", status, "createdAt", "updatedAt") FROM stdin;
    public          root    false    223   �D       Z          0    41238    Table 
   TABLE DATA           x   COPY public."Table" (id, "tableNumber", status, capacity, token, "orderId", note, "createdAt", "updatedAt") FROM stdin;
    public          root    false    221   �D       T          0    41181    _prisma_migrations 
   TABLE DATA           �   COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
    public          root    false    215   FF       l           0    0    Category_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public."Category_id_seq"', 6, true);
          public          root    false    218            m           0    0    Food_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public."Food_id_seq"', 11, true);
          public          root    false    216            n           0    0    OrderSession_id_seq    SEQUENCE SET     D   SELECT pg_catalog.setval('public."OrderSession_id_seq"', 21, true);
          public          root    false    222            o           0    0    Order_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public."Order_id_seq"', 164, true);
          public          root    false    224            p           0    0    Table_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public."Table_id_seq"', 9, true);
          public          root    false    220            �           2606    41236    Category Category_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public."Category"
    ADD CONSTRAINT "Category_pkey" PRIMARY KEY (id);
 D   ALTER TABLE ONLY public."Category" DROP CONSTRAINT "Category_pkey";
       public            root    false    219            �           2606    41226    Food Food_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public."Food"
    ADD CONSTRAINT "Food_pkey" PRIMARY KEY (id);
 <   ALTER TABLE ONLY public."Food" DROP CONSTRAINT "Food_pkey";
       public            root    false    217            �           2606    41258    OrderSession OrderSession_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY public."OrderSession"
    ADD CONSTRAINT "OrderSession_pkey" PRIMARY KEY (id);
 L   ALTER TABLE ONLY public."OrderSession" DROP CONSTRAINT "OrderSession_pkey";
       public            root    false    223            �           2606    41269    Order Order_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_pkey" PRIMARY KEY (id);
 >   ALTER TABLE ONLY public."Order" DROP CONSTRAINT "Order_pkey";
       public            root    false    225            �           2606    41247    Table Table_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public."Table"
    ADD CONSTRAINT "Table_pkey" PRIMARY KEY (id);
 >   ALTER TABLE ONLY public."Table" DROP CONSTRAINT "Table_pkey";
       public            root    false    221            �           2606    41189 *   _prisma_migrations _prisma_migrations_pkey 
   CONSTRAINT     h   ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);
 T   ALTER TABLE ONLY public._prisma_migrations DROP CONSTRAINT _prisma_migrations_pkey;
       public            root    false    215            �           1259    41272    OrderSession_orderId_key    INDEX     a   CREATE UNIQUE INDEX "OrderSession_orderId_key" ON public."OrderSession" USING btree ("orderId");
 .   DROP INDEX public."OrderSession_orderId_key";
       public            root    false    223            �           1259    41270    Table_tableNumber_key    INDEX     [   CREATE UNIQUE INDEX "Table_tableNumber_key" ON public."Table" USING btree ("tableNumber");
 +   DROP INDEX public."Table_tableNumber_key";
       public            root    false    221            �           1259    41271    Table_token_key    INDEX     M   CREATE UNIQUE INDEX "Table_token_key" ON public."Table" USING btree (token);
 %   DROP INDEX public."Table_token_key";
       public            root    false    221            �           2606    41273    Food Food_categoryId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Food"
    ADD CONSTRAINT "Food_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public."Category"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 G   ALTER TABLE ONLY public."Food" DROP CONSTRAINT "Food_categoryId_fkey";
       public          root    false    217    219    3256            �           2606    41283    Order Order_foodId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES public."Food"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 E   ALTER TABLE ONLY public."Order" DROP CONSTRAINT "Order_foodId_fkey";
       public          root    false    217    225    3254            �           2606    41278    Order Order_orderSessionId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_orderSessionId_fkey" FOREIGN KEY ("orderSessionId") REFERENCES public."OrderSession"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 M   ALTER TABLE ONLY public."Order" DROP CONSTRAINT "Order_orderSessionId_fkey";
       public          root    false    223    3263    225            X   �   x���=
�@��:s
/�a3����èj/H�&��Xh��6�Q�DҨE��睭
��A�B��҄RꅉɆTYv^��>��1��W��B���!��M-ds�}@׿;���ұB��B/c����8=�٤���-�	9A��φ�u����cih�D��ut�      V   �  x��V�k�F�,���|����ӝ�;Y6�6�����tR�Ȗjɱ�Os7H7�oe#l0�Q��[����O��;1]3H���^�=�{�=��U�_U�7��E5�����ξ�槵���j���?�ξ��[��aY�E�u�A�L�a<�#�����)p@�ą��B�A�e�8$��Lr@�
��3�r汥�=P���1k�0/�is�z�����s�o����ze��/�а�V�k�h	�N8�e84�Ǳ�2�����8B���clAdC�B;�4�!	� �g�$N�"�����Q�"WY�Vgόqb��Y^��q^j8e0N\�Bc7D���Uq�QG����!�H����Q��~: ��^��eo�G���>�>�Ono�]o  �E/��7��g���Wc��ߚ�.�?j��E�<:��"��e)!���G@'�JF|*���pE�\'��1k1�dX��O��:��؟�ȿ0���~z l/-�Ġ(� ��-C@ב-�d�~7�FQv&*�?x4iR>�p��� M�;Pa"\)J�f����p,K��.c�� �� 4���>�kR D��$��6�D���!� � ���YM�����w�����[�LԠu����Q~��٢�Bb�c�kDny�n~6{l��ύ?7x�1�1�&cMj�B�j�����.���h���u��x����!=3lb�ݝf�j\�hcg=o�aB�`^/������^^�۽�.�c�z�o
�T�[��:� �%;���D*�wK�mG�`�hz�w\ܙd7��6��[�i���s�~v��_�C�0�� XH�O����ka42�-���2O�T��caJ�Vw;%�c^h�ե3Z�~*F���k"m�V��,���V�C����2���N>�r`��v���1ނ�2'�m-Suo�	����s�n���ע�iJ��4�L}��Z�]�ER��U$�i�FI����a�d�k!���������#Ņ�@���0W� @��c�B�}m6��������w�.��UC@#� ���}�XP.��i՚���i��h4hg�V�ȾXt�~�̇��J*O1D����P�����������`�w{��M�����pI�9E@�����Zx	������>pZ��?k�?�      ^      x������ � �      \   F   x�32��r�525070Ӎ�
4�0�4�p�s��s�4202�50�50S0��26�20�3�0�%����� ���      Z   T  x����n�0E��W�b�?���Z[�<C bS(jhAP��7��@bSA�it5s�3)�#Ӊ�;I3��oqʥG���B���Iq�3 ��X!}�W�@� k��
�	�
�(8�+@H�b��'	E�`�7>W�i��;*C�4 �׸]�Ds�/ ���q�3I�1[����aQvKk��0W��y�El�Ym'���Y����L�yn׋Ҩtx(�`W����g9bzr����#oo�����P>�mj����Y�+�*Swb�^>Fe�J����O+�ⷢ�I��N���j��^M�M�\���|�:�\�����%Ս��賉��G�w:�@�xF0�_��ó      T   �   x�m�=�0@�9;J��'�9'�T9�;1��_Pf��=}��v�����f��g'����M,@Z'�q4E5�u� wjU5F	"�
6XK5�l_κ �d��� ��rhz�]��`$$�x�����_�lϫ��Z�|IۚR� ~0}     